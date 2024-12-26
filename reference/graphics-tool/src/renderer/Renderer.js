import { ResourceProvider } from './ResourceProvider'
import { LayerHandler } from './LayerHandler'

export class Renderer {
	constructor(containerElement) {
		// This renderer has only one layer.
		this.layer = new LayerHandler(containerElement, 'default-layer', 0)
		this.graphicState = ''
	}

	setGraphic(graphic) {
		this.graphic = graphic
	}
	/** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
	async loadGraphic() {
		if (this.graphicState.includes('pre')) throw new Error('loadGraphic called too quick')
		try {
			this.graphicState = 'pre-load'
			this.loadGraphicStartTime = Date.now()
			await this.layer.loadGraphic(this.graphic.path)
			this.graphicState = 'post-load'
			this.loadGraphicEndTime = Date.now()
		} catch (e) {
			this.graphicState = 'error'
			console.error(e)
			throw e
		}
	}
	/** Clear/unloads a GraphicInstance on a RenderTarget */
	async clearGraphic() {
		if (this.graphicState.includes('pre')) throw new Error('clearGraphic called too quick')
		try {
			this.graphicState = 'pre-clear'
			this.clearGraphicStartTime = Date.now()
			await this.layer.clearGraphic()
			this.graphicState = 'post-clear'
			this.clearGraphicEndTime = Date.now()
		} catch (e) {
			this.graphicState = 'error'
			console.error(e)
			throw e
		}
	}
	/** Invokes an action on a graphicInstance. Actions are defined by the Graphic's manifest */
	async invokeGraphicAction(actionId, payload) {
		return this.layer.invokeAction(actionId, payload)
	}
}
