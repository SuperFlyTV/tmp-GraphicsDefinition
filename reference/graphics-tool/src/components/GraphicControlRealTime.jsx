import * as React from 'react'
import { Button, Accordion } from 'react-bootstrap'
import { issueTracker } from '../renderer/IssueTracker.js'
import { GDDGUI } from '../lib/GDD/gdd-gui.jsx'
import { getDefaultDataFromSchema } from '../lib/GDD/gdd/data.js'

export function GraphicControlRealTime({ rendererRef, autoReloadActionsRef, manifest }) {
	const supportsRealTime = manifest.rendering?.supportsRealTime
	return (
		<div>
			<Accordion defaultActiveKey={['0']} alwaysOpen>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Graphic Control</Accordion.Header>
					<Accordion.Body>
						{supportsRealTime ? (
							<>
								<div>
									<Button
										onClick={() => {
											issueTracker.clear()
											rendererRef.current.loadGraphic().catch(console.error)
										}}
									>
										Load Graphic
									</Button>
									<Button
										onClick={() => {
											rendererRef.current.clearGraphic().catch(console.error)
										}}
									>
										Clear Graphic
									</Button>
								</div>
								<div>
									<GraphicsActions
										rendererRef={rendererRef}
										autoReloadActionsRef={autoReloadActionsRef}
										manifest={manifest}
									/>
								</div>
							</>
						) : (
							<div className="alert alert-warning">This graphic does not support real-time rendering.</div>
						)}
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	)
}
function GraphicsActions({ manifest, rendererRef, autoReloadActionsRef }) {
	return (
		<div className="graphics-actions">
			{Object.entries(manifest.actions || {}).map(([actionId, action]) => {
				return (
					<GraphicsAction
						key={actionId}
						rendererRef={rendererRef}
						autoReloadActionsRef={autoReloadActionsRef}
						actionId={actionId}
						action={action}
					/>
				)
			})}
		</div>
	)
}
function GraphicsAction({ actionId, action, rendererRef, autoReloadActionsRef }) {
	const initialData = action.schema ? getDefaultDataFromSchema(action.schema) : {}
	const schema = action.schema

	const [data, setData] = React.useState(initialData)

	const onDataSave = (d) => {
		setData(JSON.parse(JSON.stringify(d)))
	}

	return (
		<div className="graphics-action card">
			<div className="card-header">
				<h5>{action.label ?? actionId}</h5>
			</div>
			<div className="card-body">
				<div>{schema && <GDDGUI schema={schema} data={data} setData={onDataSave} />}</div>
				<Button
					onClick={(e) => {
						// Invoke action:

						rendererRef.current.invokeGraphicAction(actionId, data).catch(console.error)
						if (e.shiftKey) {
							// Schedule action to run at next auto-reload:
							autoReloadActionsRef.current.push({
								actionId: actionId,
								data: data,
								delay: Date.now() - rendererRef.current.loadGraphicEndTime,
							})
						}
					}}
				>
					{action.label}
				</Button>
			</div>
		</div>
	)
}
