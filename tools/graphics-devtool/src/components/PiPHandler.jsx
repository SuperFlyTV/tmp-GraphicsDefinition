import * as React from 'react'
import { Table, Button, ButtonGroup, Form, Accordion, Row, Col } from 'react-bootstrap'

export function PiPHandler({ rendererRef, settings, canvasRef, canvasContainerRef }) {
	const deactivatePiP = React.useCallback(() => {
		canvasContainerRef.current.append(canvasRef.current)
	}, [])

	const activatePiP = React.useCallback(() => {
		// Early return if there's already a Picture-in-Picture window open
		if (window.documentPictureInPicture.window) {
			return
		}

		// Open a Picture-in-Picture window.
		window.documentPictureInPicture
			.requestWindow({
				width: settings.width,
				height: settings.height,
			})
			.then((pipWindow) => {
				// Move the player to the Picture-in-Picture window.
				console.log('rendererRef.current', canvasRef.current)
				pipWindow.document.body.append(canvasRef.current)

				pipWindow.addEventListener('pagehide', (event) => {
					deactivatePiP()
					// inPipMessage.style.display = "none";
					// playerContainer.append(videoPlayer);
				})
			})
			.catch(console.error)
	}, [settings.width, settings.height])

	if (!('documentPictureInPicture' in window)) return

	return <Button onClick={activatePiP}>PiP</Button>
}
