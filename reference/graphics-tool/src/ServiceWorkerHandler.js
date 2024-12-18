import { register } from "register-service-worker"

class ServiceWorkerHandler {

    constructor() {
        this.broadcast = new BroadcastChannel('intercept-channel')

        this.broadcast.onmessage = (event) => {
            console.log('got message', event);
            const msg = event.data

            const id = msg.id
            if (msg.type === 'fetch') {
                msg.url

                this.fileHandler.readFile(msg.url)
                    .then((result) => {
                        console.log('readFile result', result)
                        this.broadcast.postMessage({
                            reply: id,
                            result: result
                        })
                    }).catch((error) => {
                        console.error('readFile error', error)
                        this.broadcast.postMessage({
                            reply: id,
                            error: error
                        })
                    })

            } else {
                console.log('unknown message', msg)
            }
        };
        // broadcast.postMessage({
        //     type: 'INCREASE_COUNT',
        //   });
    }
    async init(fileHandler) {
        if (this.initialized) return
        this.initialized = true
        this.fileHandler = fileHandler

        const FILE_NAME = '/service-worker.js'

        const registrations = await navigator.serviceWorker.getRegistrations()

        const alreadyRegistered = registrations.find((r) => r.active && r.active.scriptURL.includes(FILE_NAME))
        if (alreadyRegistered) return alreadyRegistered

        console.log('registering service worker...')
        return new Promise((resolve, reject) => {

            register(FILE_NAME, {
                registrationOptions: { scope: './' },
                ready(registration) {
                    console.log('Service worker is active.', registration)
                    resolve(registration)
                },
                registered(registration) {
                    // console.log('Service worker has been registered.')
                },
                cached(registration) {
                    // console.log('Content has been cached for offline use.')
                },
                updatefound(registration) {
                    // console.log('New content is downloading.')
                },
                updated(registration) {
                    // console.log('New content is available; please refresh.')
                },
                offline() {
                    // console.log('No internet connection found. App is running in offline mode.')
                },
                error(error) {
                    console.error('Error during service worker registration:', error)
                    reject(error)
                }
            })
        })
    }
}
export const serviceWorkerHandler = new ServiceWorkerHandler()
