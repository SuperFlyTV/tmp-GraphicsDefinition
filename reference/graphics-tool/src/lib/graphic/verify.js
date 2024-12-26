export function verifyGraphicManifest(manifest) {
	// TMP!
	// This should instead use the json schema to verify the manifest

	let errors = []

	if (manifest.id === undefined) errors.push('Manifest is missing the "id" property')
	if (manifest.version === undefined) errors.push('Manifest is missing the "version" property')
	if (!manifest.name) errors.push('Manifest is missing the "name" property')
	if (!manifest.actions) errors.push('Manifest is missing the "actions" property')
	if (!manifest.rendering) errors.push('Manifest is missing the "rendering" property')

	if (typeof manifest.id !== 'string') errors.push('Manifest "id" property must be a string')
	if (typeof manifest.version !== 'number') errors.push('Manifest "version" property must be a number')
	if (typeof manifest.name !== 'string') errors.push('Manifest "name" property must be a string')
	if (typeof manifest.actions !== 'object') errors.push('Manifest "actions" property must be an object')
	if (typeof manifest.rendering.supportsRealTime !== 'boolean')
		errors.push('Manifest "rendering.supportsRealTime" property must be a boolean')
	if (typeof manifest.rendering.supportsNonRealTime !== 'boolean')
		errors.push('Manifest "rendering.supportsNonRealTime" property must be a boolean')

	if (manifest.description && typeof manifest.description !== 'string')
		errors.push('Manifest "description" property must be a string')
	if (manifest.author && typeof manifest.author !== 'object')
		errors.push('Manifest "author" property must be an object')

	if (manifest.author) {
		if (typeof manifest.author.name !== 'string') errors.push('Manifest "author.name" property must be a string')
		if (manifest.author.email && typeof manifest.author.email !== 'string')
			errors.push('Manifest "author.email" property must be a string')
		if (manifest.author.url && typeof manifest.author.url !== 'string')
			errors.push('Manifest "author.url" property must be a string')
	}

	for (const [key, action] of Object.entries(manifest.actions)) {
		if (typeof action !== 'object') errors.push(`Manifest "actions.${key}" property must be an object`)
		if (!action.label) errors.push(`Manifest "actions.${key}" is missing the "label" property`)
		if (typeof action.schema !== 'object' && action.schema !== null)
			errors.push(`Manifest "actions.${key}" is missing the "schema" property`)

		if (typeof action.label !== 'string') errors.push(`Manifest "actions.${key}.label" property must be a string`)
		if (action.description && typeof action.description !== 'string')
			errors.push(`Manifest "actions.${key}.description" property must be a string`)
	}

	return errors.join('\n')
}
