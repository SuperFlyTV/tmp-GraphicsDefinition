const SW_VERSION = '2025-03-11T09:06:03.951Z' // Updated at build time

let requestId = 0
const requestMap = new Map()

const broadcastToParent = new BroadcastChannel('intercept-channel-main')
const broadcastFromParent = new BroadcastChannel('intercept-channel-sw')
broadcastFromParent.onmessage = (event) => {
	const msg = event.data

	if (msg && msg.reply !== undefined) {
		const waiting = requestMap.get(msg.reply)
		if (waiting) {
			requestMap.delete(msg.reply)

			if (msg.error) waiting.reject(msg.error)
			else waiting.resolve(msg.result)
		} else {
			// console.error('no waiting for', msg.reply)
		}
	} else if (msg && msg.type === 'request-version') {
		broadcastToParent.postMessage({
			type: 'sw-version',
			reply: msg.id,
			result: SW_VERSION,
		})
	}
}

self.addEventListener('fetch', function (event) {
	// file from url:
	const url = event.request.url
	let newUrl = url
	const m = url.match(/(LOCAL)(\/.*)/i)
	if (m) {
		console.debug('fetch intercepting', event.request.url)
		// intercept the request and serve the file from local disk:
		event.respondWith(
			new Promise((resolve, reject) => {
				const id = requestId++

				requestMap.set(id, { resolve, reject })

				broadcastToParent.postMessage({
					type: 'fetch',
					id: id,
					url: decodeURIComponent(m[2]),
				})
			})
				.then((result) => {
					if (result === 'NotFoundError') {
						return new Response(null, {
							status: 404,
							statusText: `File not found`,
						})
					} else {
						return new Response(result.arrayBuffer, {
							headers: {
								'Content-Type': result.type,
								// Prevent any caching:
								'Cache-Control': 'no-cache, no-store, must-revalidate',
								Pragma: 'no-cache',
								Expires: '0',
							},
						})
					}
				})
				.catch((error) => {
					return new Response(null, {
						status: 500,
						statusText: `Error when intercepting request: ${error}`,
					})
				})
		)
	} else {
		console.debug('fetch (letting through)', event.request.url)
		event.respondWith(
			fetch(newUrl)
			// intercept requests by handling event.request here
		)
	}
})
