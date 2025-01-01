import * as React from 'react'
import { fileHandler } from './FileHandler'
import { serviceWorkerHandler } from './ServiceWorkerHandler.js'
import { InitialView } from './views/InitialView'
import { ListGraphics } from './views/ListGraphics'
import { GraphicTester } from './views/GraphicTester.jsx'

export function App() {
	const [graphics, setGraphics] = React.useState(false)
	const [selectedGraphic, setSelectedGraphic] = React.useState(null)

	const [serviceWorker, setServiceWorker] = React.useState(null)
	const [serviceWorkerError, setServiceWorkerError] = React.useState(null)

	// Initialize Service Worker:
	React.useEffect(() => {
		if (!serviceWorker) {
			serviceWorkerHandler
				.init(fileHandler)
				.then((sw) => {
					setServiceWorker(sw)
				})
				.catch((e) => {
					setServiceWorker(null)
					setServiceWorkerError(e)
					console.error(e)
				})
		}
	}, [serviceWorker])

	const onSelectGraphic = React.useCallback((graphic) => {
		setSelectedGraphic(graphic)
	}, [])
	const onRefreshGraphics = React.useCallback(() => {
		fileHandler.listGraphics().then(setGraphics).catch(console.error)
	}, [])

	if (!serviceWorker) {
		return (
			<div>
				<span>Initializing, please wait..</span>
				<div>{serviceWorkerError && <span>Error: {serviceWorkerError.message}</span>}</div>
			</div>
		)
	}

	return (
		<>
			{selectedGraphic ? (
				<GraphicTester
					graphic={selectedGraphic}
					onExit={() => {
						setSelectedGraphic(null)
					}}
				/>
			) : graphics ? (
				<ListGraphics graphics={graphics} onSelect={onSelectGraphic} onRefresh={onRefreshGraphics} />
			) : (
				<InitialView setGraphics={setGraphics} />
			)}
		</>
	)
}
