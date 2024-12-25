import { ResourceProvider } from "./ResourceProvider"
import { LayerHandler } from "./LayerHandler"

export class Renderer {

    constructor (containerElement) {

        // This renderer has only one layer.
        this.layer = new LayerHandler(containerElement, 'default-layer', 0)
    }

    setGraphic (graphic) {
        this.graphic = graphic
    }
    /** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
    async loadGraphic () {
        this.graphicState = 'pre-load'
        this.loadGraphicStartTime = Date.now()
        await this.layer.loadGraphic(this.graphic.path)
        this.graphicState = 'post-load'
        this.loadGraphicEndTime = Date.now()
    }
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    async clearGraphic () {
        this.graphicState = 'pre-clear'
        this.clearGraphicStartTime = Date.now()
        await this.layer.clearGraphic()
        this.graphicState = 'post-clear'
        this.clearGraphicEndTime = Date.now()
    }
    /** Invokes an action on a graphicInstance. Actions are defined by the Graphic's manifest */
    async invokeGraphicAction (params) {
        return this.layer.invokeAction(params)
    }
}
