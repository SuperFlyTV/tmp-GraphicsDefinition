import * as React from 'react'
import { Form, Accordion, Row, Col } from 'react-bootstrap'

export function GraphicSettings({ settings, onChange }) {
	settings = JSON.parse(JSON.stringify(settings))

	const handleOnChange = React.useCallback(
		(event, key, transform) => {
			const newValue = transform ? transform(event.target.value) : event.target.value

			if (newValue === undefined) return
			settings[key] = newValue
			onChange(settings)
		},
		[settings, onChange]
	)

	return (
		<div>
			<Accordion defaultActiveKey={['0']} alwaysOpen>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Settings</Accordion.Header>
					<Accordion.Body>
						<Form>
							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Renderer Type</Form.Label>
										<Form.Select
											value={`${settings.realtime ? '1' : '0'}`}
											onChange={(e) => handleOnChange(e, 'realtime', (v) => v === '1')}
										>
											<option value="1">Real Time</option>
											<option value="0">Non Real Time</option>
										</Form.Select>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Width</Form.Label>
										<Form.Control type="number" value={settings.width} onChange={(e) => handleOnChange(e, 'width')} />
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Height</Form.Label>
										<Form.Control type="number" value={settings.height} onChange={(e) => handleOnChange(e, 'height')} />
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Auto-reload interval (ms)</Form.Label>
										<Form.Control
											type="number"
											value={`${settings.autoReloadInterval}`}
											onChange={(e) =>
												handleOnChange(e, 'autoReloadInterval', (v) => {
													const num = parseInt(v)
													if (Number.isNaN(num)) return undefined
													if (`${v}`[0] === '0') return v
													return num
												})
											}
										/>
										<Form.Text>
											When Auto-reload is active, the graphic will be cleared and loaded on an interval. To add Actions
											to the reload, shift-click on an action to add it.
											<br />
											(set to 0 to disable Auto-reload)
										</Form.Text>
									</Form.Group>
								</Col>
							</Row>
						</Form>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	)
}
export const DEFAULT_SETTINGS = {
	realtime: true,
	width: 1280,
	height: 720,
	autoReloadInterval: 0,
}
