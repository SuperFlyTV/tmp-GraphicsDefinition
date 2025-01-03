export function pathJoin(...paths) {
	return paths.join('/').replace(/\/+/g, '/')
}
export function graphicResourcePath(...paths) {
	// This URL prefix causes the service-worker to intercept the requests and serve the file from the local file system:

	const prefix = window.location.href.includes('https') ? 'https://' : 'http://'

	return pathJoin(`${prefix}LOCAL/`, ...paths)
}
export async function sleep(ms) {
	await new Promise((resolve) => setTimeout(resolve, ms))
}
