import { Validator } from 'jsonschema'

let cachedCache = null
export async function setupSchemaValidator() {
	if (!cachedCache) {
		const cache = localStorage.getItem('schema-cache')
		if (cache) cachedCache = JSON.parse(cache)
	}

	const v = await _setupSchemaValidator({
		fetch: async (url) => {
			const response = await fetch(url)
			if (!response.ok) throw new Error(`Failed to fetch schema from "${url}"`)
			return response.json()
		},
		getCache: () => {
			return cachedCache ?? {}
		},
	})

	if (v.cache) {
		localStorage.setItem('schema-cache', JSON.stringify(v.cache))
		cachedCache = v.cache
	}
	return v.validate
}

/**
 * Downloads the GDD meta-schemas needed for the validator to work
 * @returns
 */
async function _setupSchemaValidator(
	options
	/*: {
	fetch: (url: string) => Promise<any>
	getCache?: () => Promise<ValidatorCache>
}): Promise<{
	validate: SchemaValidator
	cache: ValidatorCache | null
}> {
*/
) {
	if (cachedValidator) {
		return {
			validate: cachedValidator,
			cache: null,
		}
	}

	const cache = options.getCache ? await options.getCache() : {}

	const baseURL = 'http://127.0.0.1:8084/json-schema/v1/graphics-manifest/schema.json'

	const v = new Validator()
	async function addRef(ref) {
		// Check if it is in the local cache first:
		if (cache[ref]) {
			v.addSchema(cache[ref], ref)
			return cache[ref]
		} else {
			const content = await options.fetch(ref)
			if (!content) throw new Error(`Not able to resolve schema for "${ref}"`)
			v.addSchema(content, ref)
			cache[ref] = content
			return content
		}
	}

	let handledRefs = 0
	let bailOut = false
	const handled = new Set()
	async function handleUnresolvedRefs() {
		if (bailOut) return

		const refsToHandle = []
		for (let i = 0; i < v.unresolvedRefs.length; i++) {
			const ref = v.unresolvedRefs.shift()
			if (!ref) break
			if (refsToHandle.length > 30) break
			if (handled.has(ref)) continue

			refsToHandle.push(ref)
			handled.add(ref)
		}
		await Promise.all(
			refsToHandle.map(async (ref) => {
				handledRefs++
				if (handledRefs > 100) {
					bailOut = true
					return
				}

				const fixedRef = ref.replace(/#.*/, '')

				await addRef(fixedRef)
				await handleUnresolvedRefs()
			})
		)
	}
	// const baseSchema = await addRef(baseURL + '/v1/schema.json')
	const baseSchema = await addRef(baseURL + '')
	await handleUnresolvedRefs()

	if (bailOut) throw new Error(`Bailing out, more than ${handledRefs} references found!`)

	cachedValidator = (schema) => {
		const result = v.validate(schema, baseSchema)

		return result.errors.map((err) => {
			const pathStr = err.path.join('.')
			return `${pathStr}: ${err.message}`
		})
	}
	return {
		validate: cachedValidator,
		cache: cache,
	}
}
let cachedValidator = null
