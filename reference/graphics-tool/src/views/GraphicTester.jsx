import * as React from 'react'
import { Table, Button, ButtonGroup, Form, Accordion, Row, Col } from 'react-bootstrap'
import { graphicResourcePath } from '../lib/lib.js'
import { Renderer } from '../renderer/Renderer.js'
import { fileHandler } from '../FileHandler.js'
import { issueTracker } from '../renderer/IssueTracker.js'
import { verifyGraphicManifest } from '../lib/graphic/verify.js'
import { GraphicSettings, DEFAULT_SETTINGS } from '../components/GraphicSettings.jsx'
import { GraphicControlRealTime } from '../components/GraphicControlRealTime.jsx'
import { GraphicCapabilities } from '../components/GraphicCapabilities.jsx'

export function GraphicTester({ graphic, onExit }) {
	const [settings, setSettings] = React.useState(DEFAULT_SETTINGS)

	const [graphicManifest, setGraphicManifest] = React.useState(null)
	const [graphicManifestError, setGraphicManifestError] = React.useState([])
	const [errorMessage, setErrorMessage] = React.useState('')

	const canvasRef = React.useRef(null)
	const rendererRef = React.useRef(null)

	// const [graphicManifest, setGraphicManifest] = React.useState(null)

	const onError = React.useCallback((e) => {
		setErrorMessage(`${e.message || e}`)
		console.error(e)
	}, [])

	React.useLayoutEffect(() => {
		if (!rendererRef.current) {
			if (canvasRef.current) {
				rendererRef.current = new Renderer(canvasRef.current)
				rendererRef.current.setGraphic(graphic)
			}
		}
	}, [])

	React.useEffect(() => {
		rendererRef.current.setGraphic(graphic)
	}, [graphic])

	React.useEffect(() => {
		const listener = fileHandler.listenToFileChanges(() => {
			// on File change
			reloadGraphic().catch(onError)
		})
		return () => {
			listener.stop()
		}
	}, [])
	const [issues, setIssues] = React.useState([])
	React.useEffect(() => {
		setIssues(issueTracker.issues)
		const listener = issueTracker.listenToChanges(() => {
			setIssues([...issueTracker.issues])
		})
		return () => {
			listener.stop()
		}
	}, [])

	const reloadGraphic = React.useCallback(async () => {
		await rendererRef.current.clearGraphic()
		issueTracker.clear()
		await reloadGraphicManifest()
		await rendererRef.current.loadGraphic().catch(console.error)
	}, [])

	const reloadGraphicManifest = React.useCallback(async () => {
		const r = await fetch(graphicResourcePath(graphic.path, 'manifest.json'))

		const manifest = await r.json()
		setGraphicManifest(manifest)
	}, [graphic.path])

	const autoReloadActionsRef = React.useRef([])
	React.useEffect(() => {
		if (settings.autoReloadInterval > 500) {
			let active = true
			let reloadInterval = 0
			const triggerReload = () => {
				reloadGraphic()
					.then(() => {
						if (active) {
							for (const action of autoReloadActionsRef.current) {
								setTimeout(() => {
									if (!active) return

									rendererRef.current.invokeGraphicAction(action.actionId, action.data).catch(console.error)
								}, action.delay)
							}

							reloadInterval = setTimeout(() => {
								reloadInterval = 0
								if (active) triggerReload()
							}, settings.autoReloadInterval)
						}
					})
					.catch(onError)
			}
			const initTimeout = setTimeout(() => {
				triggerReload()
			}, 100)
			return () => {
				clearTimeout(initTimeout)
				if (reloadInterval) clearTimeout(reloadInterval)
				active = false
			}
		}
	}, [settings])

	// Load the graphic manifest:
	React.useEffect(() => {
		if (!graphicManifest) reloadGraphicManifest().catch(onError)
	}, [])

	React.useEffect(() => {
		if (graphicManifest) {
			const errors = verifyGraphicManifest(graphicManifest)

			setGraphicManifestError((prevValue) => {
				if (JSON.stringify(prevValue) !== JSON.stringify(errors)) {
					return errors
				} else {
					return prevValue
				}
			})
		} else {
			setGraphicManifestError('No manifest loaded')
		}
	}, [graphicManifest])

	// Init:
	const initRef = React.useRef(true)
	React.useEffect(() => {
		if (initRef.current) {
			initRef.current = false

			reloadGraphic().catch(onError)
		}
	}, [])

	return (
		<>
			<div className="container-md">
				<div className="graphic-tester card">
					<div className="card-body">
						<div>
							<Button onClick={onExit}>👈Go back</Button>
						</div>

						<div className="settings">
							<GraphicSettings
								settings={settings}
								onChange={(newSettings) => {
									setSettings(newSettings)
								}}
							/>
						</div>
						<div className="capabilities">
							{graphicManifest ? (
								<GraphicCapabilities manifest={graphicManifest} graphicError={graphicManifestError} />
							) : null}
						</div>
						<div className="control">
							{graphicManifest ? (
								<GraphicControlRealTime
									rendererRef={rendererRef}
									autoReloadActionsRef={autoReloadActionsRef}
									manifest={graphicManifest}
								/>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className="container-fluid">
				<div className="graphic-tester-render card">
					<div className="card-body">
						<div>
							<AutoReloadBar rendererRef={rendererRef} settings={settings} />
						</div>
						<div>
							{errorMessage && (
								<div className="alert alert-danger" role="alert">
									Error: {errorMessage}
								</div>
							)}
						</div>
						<div>
							{issues.length ? (
								<div className="alert alert-danger" role="alert">
									Issues:
									<ul>
										{issues.map((issue, index) => (
											<li key={index}>{issue}</li>
										))}
									</ul>
								</div>
							) : null}
						</div>
						<div
							ref={canvasRef}
							className="graphic-canvas"
							style={{
								width: settings.width,
								height: settings.height,
							}}
						></div>
					</div>
				</div>
			</div>
		</>
	)
}

function AutoReloadBar({ rendererRef, settings }) {
	// const barRef = React.useRef(null)

	const [width, setWidth] = React.useState(0)
	const [message, setMessage] = React.useState(null)

	React.useEffect(() => {
		let active = true
		const triggerNextFrame = () => {
			if (!active) return

			// On each frame:
			window.requestAnimationFrame(() => {
				if (!active) return
				triggerNextFrame()

				if (!rendererRef.current) return

				const graphicState = rendererRef.current.graphicState
				const loadGraphicEndTime = rendererRef.current.loadGraphicEndTime || 0
				const autoReloadInterval = parseInt(settings.autoReloadInterval) || 0

				if (graphicState === 'pre-load') {
					setWidth(0)
					setMessage('Loading...')
				} else if (graphicState === 'post-load') {
					setMessage('Loaded')
					if (autoReloadInterval) {
						setWidth((Date.now() - loadGraphicEndTime) / autoReloadInterval)
					} else {
						setWidth(0)
					}
				} else if (graphicState === 'pre-clear') {
					setMessage('Clearing...')
				} else if (graphicState === 'post-clear') {
					setMessage('Cleared')
					setWidth(0)
				} else if (graphicState === '') {
					// nothing
				} else {
					setMessage(`Unknown state: "${graphicState}"`)
				}
			})
		}
		triggerNextFrame()
		return () => {
			active = false
		}
	}, [rendererRef, settings])
	return (
		<div className="auto-reload-bar">
			<div
				className="auto-reload-bar_bar"
				style={{
					width: `${width * 100}%`,
				}}
			></div>
			<div className="auto-reload-bar_message">{message ? `Status: ${message}` : ''}</div>
		</div>
	)
}
