import { GraphicInvokePayload, GraphicLoadPayload } from "../definitions/graphic"
import { GraphicInstanceStatus } from "../definitions/graphicInstance"
import { EmptyPayload } from "../definitions/renderer"



/**
 * Methods called on a GraphicsInstance by the Renderer
 * @throws GraphicsError
 */
export interface GraphicsApi {
    /**
     * Called by the Renderer when the Graphic has been loaded into the DOM
     */
    load: (payload: GraphicLoadPayload) => Promise<void>
    /**
     * Called by the Renderer to force the Graphic to terminate/dispose/clear any loaded resources.
     * This is called after the Renderer has uloaded the Graphic from the DOM.
     */
    dispose: (payload: EmptyPayload) => Promise<void>

    /**
     * Called by the Renderer to retrieve the current status of the Graphic
     */
    getStatus: (payload: EmptyPayload) => Promise<GraphicInstanceStatus>
    /**
     * Called by the Renderer to invoke a method on the Graphic
     */
    invoke: (payload: GraphicInvokePayload) => Promise<unknown>
    /**
     * If the Graphic supports non-realtime rendering, this is called to make the graphic jump to a certain point in time.
     * @returns A Promise that resolves when the Graphic has finished rendering the requested frame.
     */
    tick: (payload: {
        timestamp: number
    }) => Promise<EmptyPayload>
}

/**
 * Methods called on a Renderer by the GraphicsInstance
 * @throws GraphicsError
*/
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

/**
 * When throwing errors from the Graphics it is recommended to throw this error type.
 * Based on https://www.jsonrpc.org/specification#error_object
 */
export class GraphicsError extends Error {

    constructor(
        /**
         * A Number that indicates the error type that occurred (404 not found, 500 internal error etc)
         * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
         * @see https://www.jsonrpc.org/specification#error_object
        */
        public readonly code: number,
        /**
         * A String providing a short description of the error.
         * The message SHOULD be limited to a concise single sentence.
         */
        message: string,
        /**
         * A Primitive or Structured value that contains additional information about the error.
         * This may be omitted.
         */
        public readonly data?: unknown
    ) {
        super(message)

        if (!Number.isInteger(this.code)) throw new Error("code must be an integer")

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, GraphicsError.prototype);
    }
}
