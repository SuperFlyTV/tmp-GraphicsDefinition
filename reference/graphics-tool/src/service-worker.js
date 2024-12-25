let requestId = 0
const requestMap = new Map()

const broadcast = new BroadcastChannel('intercept-channel')
broadcast.onmessage = (event) => {
	const msg = event.data
	// console.log('received message', msg)
	if (msg && msg.reply !== undefined) {
		const waiting = requestMap.get(msg.reply)
		if (waiting) {
			requestMap.delete(msg.reply)

			if (msg.error) waiting.reject(msg.error)
			else waiting.resolve(msg.result)
		} else {
			// console.error('no waiting for', msg.reply)
		}
	}
}

self.addEventListener('fetch', function (event) {
	// console.log('onfetch 5')
	// console.log(event)

	// file from url:
	const url = event.request.url
	let newUrl = url
	const m = url.match(/(LOCAL)(\/.*)/i)
	if (m) {
		// console.log('intercepting request', url, m)

		// intercept the request and serve the file from local disk:
		event.respondWith(
			new Promise((resolve, reject) => {
				const id = requestId++
				// console.log('waiting for', id)
				requestMap.set(id, { resolve, reject })

				// console.log('send request', id, m[2])

				broadcast.postMessage({
					type: 'fetch',
					id: id,
					url: m[2],
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
							},
						})
					}
					// console.log('responding!!', result)
					// result.arrayBuffer
					// result.
					// TODO
				})
				.catch((error) => {
					// console.log('responding with error!')
					return new Response(null, {
						status: 500,
						statusText: `Error when intercepting request: ${error}`,
					})
				})
		)
	} else {
		// console.log('NOT intercepting '+url)
		event.respondWith(
			fetch(newUrl)
			// intercept requests by handling event.request here
		)
	}
	// console.log('newUrl', newUrl)
})
