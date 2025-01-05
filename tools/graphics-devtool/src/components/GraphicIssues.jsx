import * as React from 'react'
import { setupSchemaValidator } from '../lib/graphic/verify.js'
import { usePromise } from '../lib/lib.js'

export function GraphicIssues({ manifest }) {
	const [graphicManifestErrors, setGraphicManifestErrors] = React.useState([])

	const validator = usePromise(async () => {
		return setupSchemaValidator()
	}, [])

	React.useEffect(() => {
		if (!validator) {
			setGraphicManifestErrors(['Loading schema validator...'])
			return
		}
		if (!manifest) {
			setGraphicManifestErrors(['No manifest loaded'])
			return
		}
		if (validator.error) {
			setGraphicManifestErrors([`${validator.error}`])
			return
		}
		const errors = validator.value(manifest)

		setGraphicManifestErrors((prevValue) => {
			if (JSON.stringify(prevValue) !== JSON.stringify(errors)) {
				return errors
			} else {
				return prevValue
			}
		})
	}, [manifest, validator])

	if (!validator) {
		return <div>Loading schema validator...</div>
	}
	return (
		<>
			{graphicManifestErrors.length ? (
				<div className="alert alert-danger">
					<div>Found a few issues in the Graphics manifest:</div>
					<div>
						<ul>
							{graphicManifestErrors.map((str, i) => {
								return <li key={i}>{str}</li>
							})}
						</ul>
					</div>
				</div>
			) : (
				<span>No issues found in manifest 👍</span>
			)}
		</>
	)
}
