import * as React from 'react'
import { Button } from 'react-bootstrap'
import { fileHandler } from '../FileHandler'

export function InitialView({ setGraphics }) {
	return (
		<div className="intial-hero">
			<div className="intial-hero-content">
				<div>
					<h1>Graphics DevTool</h1>
				</div>
				<div>
					<p>This is a tool for developing EBU HTML graphics.</p>
					<p>
						It reads Graphics from your local hard drive and displays them in this web page <br /> (nothing is sent to
						any servers).
					</p>

					<p>Begin by selecting a folder that contains Graphics in any subfolder.</p>
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
							Open local folder
						</Button>
					</p>

					<p>
						(You can also find example graphics&nbsp;
						<a
							href="https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics"
							target="_blank"
						>
							here
						</a>
						!)
					</p>
					<p>
						Source code for this app can be found at
						<br />
						<a
							href="https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics-tool"
							target="_blank"
						>
							https://github.com/SuperFlyTV/tmp-GraphicsDefinition/tree/master/reference/graphics-tool
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}
