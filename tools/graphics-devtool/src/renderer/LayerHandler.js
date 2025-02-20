import { ResourceProvider } from './ResourceProvider.js'

export class LayerHandler {
	constructor(containerElement, id, zIndex) {
		this.resourceProvider = new ResourceProvider()

		this.id = id
		this.currentGraphic = null

		this.element = document.createElement('div')
		this.element.style.position = 'absolute'
		this.element.style.top = 0
		this.element.style.left = 0
		this.element.style.right = 0
		this.element.style.bottom = 0

		this.element.style.zIndex = zIndex

		containerElement.appendChild(this.element)
	}
	getStatus() {
		return {} // RenderTargetStatus, TBD
	}
	listGraphicInstances() {
		return [] // TODO
	}

	async loadGraphic(settings, graphicPath) {
		// Clear any existing GraphicInstance:

		console.log('layer loadGraphic', new Error().stack)

		if (this.currentGraphic) {
			this.clearGraphic()
		}

		const elementName = await this.resourceProvider.loadGraphic(graphicPath)

		// Add element to DOM:
		const element = document.createElement(elementName)
		this.element.appendChild(element)

		this.currentGraphic = {
			element,
			elementName,
			graphicPath,
		}

		// const baseUrl = graphicResourcePath(graphicPath)
		// 	// Remove last "/":
		// 	.replace(/\/$/, '')

		// Load the element:
		await element.load({
			// baseUrl: baseUrl, // `${this.graphicCache.serverApiUrl}/serverApi/v1/graphics/graphic/${id}/${version}`, // /resources/:localPath
			renderType: settings.realtime ? 'realtime' : 'non-realtime',
		})
	}
	async clearGraphic() {
		if (!this.currentGraphic) return
		try {
			await this.currentGraphic.element.dispose({})
		} catch (err) {
			console.error('Error disposing GraphicInstance:', err)
		} finally {
			this.element.innerHTML = ''
			this.currentGraphic = null
		}
	}

	async invokeAction(actionId, payload) {
		if (!this.currentGraphic) return

		return {
			value: await this.currentGraphic.element.invokeAction({
				method: actionId,
				payload: payload,
			}),
		}
	}

	async goToTime(timestamp) {
		if (!this.currentGraphic) return
		await this.currentGraphic.element.goToTime({ timestamp })
	}
	async setInvokeActionsSchedule(schedule) {
		if (!this.currentGraphic) return
		await this.currentGraphic.element.setInvokeActionsSchedule({ schedule })
	}
}
