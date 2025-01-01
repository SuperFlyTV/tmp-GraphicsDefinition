import * as React from 'react'
import { Accordion, Row, Col, Form } from 'react-bootstrap'
import { SettingsContext } from '../contexts/SettingsContext.js'

export function GraphicCapabilities({ manifest, graphicError }) {
	const settingsContext = React.useContext(SettingsContext)
	const settings = JSON.parse(JSON.stringify(settingsContext.settings))
	const onChange = settingsContext.onChange

	const errorLines = graphicError ? graphicError.split('\n') : []

	return (
		<Accordion
			defaultActiveKey={settings.viewCapabilitiesAccordion}
			alwaysOpen
			onSelect={(selection) => {
				onChange({ ...settings, viewCapabilitiesAccordion: selection })
			}}
		>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Graphic Info</Accordion.Header>
				<Accordion.Body>
					<Form>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>ID</Form.Label>
									<Form.Control disabled value={manifest.id ?? ''} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Version</Form.Label>
									<Form.Control disabled value={manifest.version ?? ''} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Name</Form.Label>
									<Form.Control disabled value={manifest.name ?? ''} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Description</Form.Label>
									<Form.Control disabled value={manifest.description ?? ''} />
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Supports Real Time Rendering</Form.Label>
									<Form.Control disabled value={manifest.rendering?.supportsRealTime ? 'Yes' : 'No'} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Supports Non-Real Time Rendering</Form.Label>
									<Form.Control disabled value={manifest.rendering?.supportsNonRealTime ? 'Yes' : 'No'} />
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								{errorLines.length ? (
									<div className="alert alert-danger">
										<ul>
											{errorLines.map((str, i) => {
												return <li key={i}>{str}</li>
											})}
										</ul>
									</div>
								) : (
									<span>No issues found in manifest 👍</span>
								)}
							</Col>
						</Row>
					</Form>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	)
}
