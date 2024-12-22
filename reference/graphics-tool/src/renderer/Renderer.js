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

        await this.layer.loadGraphic(this.graphic.path)
    }
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    async clearGraphic () {
        await this.layer.clearGraphic()
    }
    /** Invokes an action on a graphicInstance. Actions are defined by the Graphic's manifest */
    async invokeGraphicAction (params) {
        return this.layer.invokeAction(params)
    }
}
