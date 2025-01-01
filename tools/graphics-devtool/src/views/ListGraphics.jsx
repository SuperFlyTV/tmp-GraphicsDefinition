import * as React from 'react'
import { Table, Button } from 'react-bootstrap'

export function ListGraphics({ graphics, onSelect, onRefresh }) {
	return (
		<div className="container-md">
			<div className="list-graphics card">
				<div>
					<h2>Select Graphic</h2>
					<Button
						onClick={() => {
							onRefresh()
						}}
					>
						Refresh
					</Button>
				</div>

				{graphics.length > 0 ? (
					<Table striped bordered>
						<thead>
							<tr>
								<th>Path</th>
								<th>Name</th>
								<th>ID-Version</th>
								<th>Capabilities</th>
								<th>Issues</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{graphics.map((graphic, i) => {
								const errorLines = graphic.error ? graphic.error.split('\n') : []
								return (
									<tr key={graphic.path}>
										<td>{graphic.path}</td>
										<td>{graphic.manifest.name}</td>
										<td>
											{graphic.manifest.id}-{graphic.manifest.version}
										</td>
										<td>
											<ul>
												{graphic.manifest.rendering?.supportsRealTime ? <li>🏃 Realtime rendering</li> : null}
												{graphic.manifest.rendering?.supportsNonRealTime ? <li>🧍 Non-Realtime rendering</li> : null}
											</ul>
										</td>
										<td>
											{errorLines.length ? (
												<ul>
													{errorLines.map((str, i) => {
														return <li key={i}>{str}</li>
													})}
												</ul>
											) : (
												<span>No issues found 👍</span>
											)}
										</td>
										<td>
											<Button onClick={() => onSelect(graphic)}>Select</Button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				) : (
					<div>
						<p>No graphics found in any the selected folder nor its subfolders</p>
						<p>Reload the page to try again</p>
					</div>
				)}
			</div>
		</div>
	)
}
