import { GraphicInvokePayload } from "../definitions/graphic"
import { GraphicInstanceStatus } from "../definitions/graphicInstance"
import { EmptyPayload } from "../definitions/renderer"



/** Methods called on a GraphicsInstance by the Renderer */
export interface GraphicsApi {
    getStatus: (payload: EmptyPayload) => Promise<GraphicInstanceStatus>
    invoke: (payload: GraphicInvokePayload) => Promise<unknown>
    /**
     * If the Graphic supports non-realtime rendering, this is called to make the graphic jump to a certain point in time.
     * @returns A Promise that resolves when the Graphic has finished rendering the requested frame.
     */
    tick: (payload: {
        timestamp: number
    }) => Promise<EmptyPayload>
}

/** Methods called on a Renderer by the GraphicsInstance */
export interface GraphicsRendererApi {

    /** Called when the GI has loaded all its resources and is ready to receive commands  */
    loaded: () => void
    /** Request to the Renderer to unload/kill the GraphicsInstance */
    unload: () => void
    /** Inform the Renderer that the GraphicsInstance status has changed */
    status: (status: GraphicInstanceStatus) => void
    /** Debugging information (for developers) */
    debug: (debugMessage: string) => void

}
