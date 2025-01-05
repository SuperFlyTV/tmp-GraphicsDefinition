import * as React from 'react'
import { Button } from 'react-bootstrap'
import { fileHandler } from '../FileHandler'

export function InitialView({ setGraphics }) {
	return (
		<div className="initial-hero">
			<div className="initial-hero-content">
				<div>
					<h1>Graphics DevTool</h1>
				</div>
				<div>
					<p>This is a tool for developing EBU HTML graphics.</p>
					<p>
						It reads Graphics from your local hard drive and displays them on this web page <br /> (nothing is sent to
						any servers).
					</p>

					<p>
						<i>
							If you haven't already got any EBU HTML Graphics on your local hard drive,
							<br /> you can download some examples&nbsp;
							<a
								href={`https://download-directory.github.io/?url=${encodeURIComponent(
									'https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics'
								)}`}
								target="_blank"
							>
								here
							</a>
							!
						</i>
					</p>

					<p>Start the DevTool by selecting a folder that contains EBU HTML Graphics in any of its subfolders.</p>
					<p>
						<Button
							onClick={() => {
								fileHandler
									.init()
									.then((graphics) => {
										setGraphics(graphics)
									})
									.catch(console.error)
							}}
						>
							Select local folder
						</Button>
					</p>

					<p>
						Source code for this app can be found at
						<br />
						<a
							href="https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/tools/graphics-devtool"
							target="_blank"
						>
							https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/tools/graphics-devtool
						</a>
					</p>
					<div>
						<TroubleShoot />
					</div>
				</div>
			</div>
		</div>
	)
}
function TroubleShoot() {
	const [message, setMessage] = React.useState('')
	return (
		<>
			If you have issues (such as graphics not loading), <br />
			try to do a full reload by following these steps:
			<div>
				<div>
					<b>Step 1:</b>
					<Button
						size="sm"
						variant="secondary"
						onClick={() => {
							navigator.serviceWorker.getRegistrations().then(async (registrations) => {
								for (const sw of registrations) {
									await sw.unregister()
								}
								localStorage.clear()
								setMessage('Service Worker unregistered. Please do a hard reload now.')
							})
						}}
					>
						Click here to clear some cached data.
					</Button>
				</div>
				{message ? <div className="alert alert-success">{message}</div> : null}

				<div>
					<b>Step 2:</b> To a "Hard Reload" by right-clicking on the <br />
					reload button in your browser and selecting "Hard reload"
				</div>
			</div>
		</>
	)
}
