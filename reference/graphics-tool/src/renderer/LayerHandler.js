import { ResourceProvider } from './ResourceProvider.js'
import { GraphicInstance } from './GraphicInstance.js'
import { graphicResourcePath } from '../lib/lib.js'

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

	async loadGraphic(graphicPath) {
		// Clear any existing GraphicInstance:

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

		const baseUrl = graphicResourcePath(graphicPath)
			// Remove last "/":
			.replace(/\/$/, '')

		// Load the element:
		await element.load({
			baseUrl: baseUrl, // `${this.graphicCache.serverApiUrl}/serverApi/v1/graphics/graphic/${id}/${version}`, // /resources/:localPath
			renderType: 'realtime',
		})
	}
	async clearGraphic() {
		// const existing = this.getGraphicInstance()
		// console.log('Clearing GraphicInstance', existing)
		if (this.currentGraphic) {
			try {
				await this.currentGraphic.element.dispose({})
			} catch (err) {
				console.error('Error disposing GraphicInstance:', err)
			} finally {
				this.element.innerHTML = ''
				this.currentGraphic = null
			}
		}
	}

	async invokeAction(params) {
		// const graphicInstance = this.getGraphicInstance()
		if (!this.currentGraphic) throw new Error(`No GraphicInstance on Layer ${params.renderTargetId}`)

		// const targetMatch = (
		//     params.target.graphic ?
		//     (
		//         params.target.graphic.id === graphicInstance.graphicId &&
		//         params.target.graphic.version === graphicInstance.graphicVersion
		//     ) :
		//     params.target.graphicInstanceId === graphicInstance.id
		// )
		// if (!targetMatch) throw new Error(`No GraphicInstance found matching target: ${JSON.stringify(params.target)}`)

		return { value: await this.currentGraphic.element.invokeAction(params.action) }
	}
}
