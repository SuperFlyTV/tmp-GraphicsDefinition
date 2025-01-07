import * as fs from 'fs'

const files = ['src/service-worker.js', 'src/lib/sw-version.js']

const version = new Date().toISOString()
for (const file of files) {
	const content = await fs.promises.readFile(file, 'utf-8')

	const newContent = content.replace(/SW_VERSION = '[^']+'/, `SW_VERSION = '${version}'`)

	await fs.promises.writeFile(file, newContent)
}
