import { graphicResourcePath } from '../lib/lib.js'


export class ResourceProvider {

    constructor() {
    }

    async loadGraphic(graphicPath) {
        const componentId = 'graphic-component' + staticComponentId++

        console.log('componentId', componentId)

        const webComponent = await this.fetchModule(graphicPath, componentId)
        customElements.define( componentId, webComponent )

        return componentId
    }
    async fetchModule(graphicPath, componentId) {
        const modulePath = graphicResourcePath(graphicPath, `graphic.mjs?componentId=${componentId}`) // `${this.serverApiUrl}/serverApi/v1/graphics/graphic/${id}/${version}/graphic`

        // Load the Graphic module:
        const module = await import(modulePath)

        if (!module.Graphic) {
            throw new Error('Module expected to expose a class named "Graphic" (found none)')
        }
        if (typeof module.Graphic !== 'function') {
            throw new Error('Module expected to expose a class named "Graphic" (Graphic is not a function)')
        }

        return module.Graphic
    }
}
let staticComponentId = 0
