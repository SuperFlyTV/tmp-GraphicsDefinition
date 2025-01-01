import { register } from 'register-service-worker'
import { issueTracker } from './renderer/IssueTracker'

class ServiceWorkerHandler {
	constructor() {
		this.previousMessageReplyId = -1

		this.broadcastFromSW = new BroadcastChannel('intercept-channel-main')
		this.broadcastToSW = new BroadcastChannel('intercept-channel-sw')

		this.broadcastFromSW.onmessage = (event) => {
			const msg = event.data

			const id = msg.id
			if (msg.type === 'fetch') {
				this.fileHandler
					.readFile(msg.url)
					.then((result) => {
						this.broadcastToSW.postMessage({
							reply: id,
							result: result,
						})
					})
					.catch((error) => {
						if (`${error}`.includes('File not found')) {
							this.broadcastToSW.postMessage({
								reply: id,
								result: 'NotFoundError',
							})
							issueTracker.add(`File "${msg.url}" was requested by the Graphic, but not found on disk.`)
						} else {
							console.error('readFile error', error)

							this.broadcastToSW.postMessage({
								reply: id,
								error: error,
							})
						}
					})
			} else {
				console.error('unknown message', msg)
			}
		}
	}
	async init(fileHandler) {
		if (this.pServiceWorker) return await this.pServiceWorker

		let registeredNewServiceWorker = false

		this.pServiceWorker = Promise.resolve().then(async () => {
			this.fileHandler = fileHandler

			const FILE_NAME = '/service-worker.js'

			const registrations = await navigator.serviceWorker.getRegistrations()

			const alreadyRegistered = registrations.find((r) => r.active && r.active.scriptURL.includes(FILE_NAME))
			if (alreadyRegistered) {
				return alreadyRegistered
			}

			registeredNewServiceWorker = true
			return new Promise((resolve, reject) => {
				register(FILE_NAME, {
					registrationOptions: { scope: './' },
					ready(registration) {
						resolve(registration)
					},
					// registered(registration) {
					// 	console.log('Service worker has been registered.')
					// },
					// cached(registration) {
					// 	console.log('Content has been cached for offline use.')
					// },
					// updatefound(registration) {
					// 	console.log('New content is downloading.')
					// },
					// updated(registration) {
					// 	console.log('New content is available; please refresh.')
					// },
					// offline() {
					// 	console.log('No internet connection found. App is running in offline mode.')
					// },
					error(error) {
						console.error('Error during service worker registration:', error)
						reject(error)
					},
				})
			})
		})

		const serviceWorker = await this.pServiceWorker

		if (registeredNewServiceWorker) {
			// If we just registered the service worker, we'll need to reload the page for it to intercept requests properly.
			// (I don't know why, but it doesn't work otherwise)

			// Avoid infinite reload loop:
			const lastReload = localStorage.getItem('serviceWorkerReload') ?? 0
			const timeSinceLastReload = Date.now() - lastReload
			if (timeSinceLastReload > 10000) {
				localStorage.setItem('serviceWorkerReload', Date.now())
				location.reload()
			}
		}

		return serviceWorker
	}
}
export const serviceWorkerHandler = new ServiceWorkerHandler()
