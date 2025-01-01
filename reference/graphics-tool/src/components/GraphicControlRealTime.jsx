import * as React from 'react'
import { Button, Accordion } from 'react-bootstrap'
import { issueTracker } from '../renderer/IssueTracker.js'
import { GDDGUI } from '../lib/GDD/gdd-gui.jsx'
import { getDefaultDataFromSchema } from '../lib/GDD/gdd/data.js'
import { SettingsContext } from '../contexts/SettingsContext.js'
import { GraphicAction } from './GraphicAction.jsx'

export function GraphicControlRealTime({ rendererRef, setInvokeActionsSchedule, manifest, schedule }) {
	const settingsContext = React.useContext(SettingsContext)
	const settings = settingsContext.settings
	const onChange = settingsContext.onChange

	console.log('settings', settings)

	const supportsRealTime = manifest.rendering?.supportsRealTime
	return (
		<div>
			<Accordion
				defaultActiveKey={settings.viewControlAccordion}
				alwaysOpen
				onSelect={(selection) => {
					onChange({ ...settings, viewControlAccordion: selection })
				}}
			>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Graphic Control</Accordion.Header>
					<Accordion.Body>
						{supportsRealTime ? (
							<>
								<div>
									<Button
										onClick={() => {
											issueTracker.clear()
											rendererRef.current.loadGraphic(settings).catch(issueTracker.add)
										}}
									>
										Load Graphic
									</Button>
									<Button
										onClick={() => {
											rendererRef.current.clearGraphic().catch(issueTracker.add)
										}}
									>
										Clear Graphic
									</Button>
								</div>
								<div>
									<GraphicsActions
										rendererRef={rendererRef}
										schedule={schedule}
										setInvokeActionsSchedule={setInvokeActionsSchedule}
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
function GraphicsActions({ manifest, rendererRef, schedule, setInvokeActionsSchedule }) {
	return (
		<>
			<div className="graphics-actions">
				{Object.entries(manifest.actions || {}).map(([actionId, action]) => {
					return (
						<GraphicAction
							key={actionId}
							rendererRef={rendererRef}
							actionId={actionId}
							action={action}
							onAction={(actionId, data, e) => {
								// Invoke action:
								rendererRef.current.invokeGraphicAction(actionId, data).catch(issueTracker.add)
								if (e.shiftKey) {
									// Add action to schedule, to run at next auto-reload:

									schedule.push({
										timestamp: Date.now() - rendererRef.current.loadGraphicEndTime,
										invokeAction: {
											method: actionId,
											payload: JSON.parse(JSON.stringify(data)),
										},
									})
									setInvokeActionsSchedule(schedule)
								}
							}}
						/>
					)
				})}
			</div>
			<div>
				<i>Tip: Shift-clicking actions will make them auto-trigger after file changed or Auto-reload.</i>
			</div>
		</>
	)
}
