import { GraphicLoadPayload } from "../definitions/graphic"
import { GraphicInstanceStatus } from "../definitions/graphicInstance"
import { ActionInvokePayload, EmptyPayload } from "../definitions/types"

/**
 * ================================================================================================
 *
 * The GraphicsAPI is a javascript interface, ie javascript methods exposed by the GraphicInstance WebComponent.
 *
 * ================================================================================================
 */


/**
 * Methods called on a GraphicInstance by the Renderer
 * @throws GraphicsError
 */
export interface GraphicsApi {
    /**
     * Called by the Renderer when the Graphic has been loaded into the DOM
     * @returns a Promise that resolves when the Graphic has finished loading it's resources.
     */
    load: (payload: GraphicLoadPayload) => Promise<void>
    
    /**
     * Called by the Renderer to force the Graphic to terminate/dispose/clear any loaded resources.
     * This is called after the Renderer has unloaded the Graphic from the DOM.
     */
    dispose: (payload: EmptyPayload) => Promise<void>

    /**
     * Called by the Renderer to retrieve the current status of the Graphic
     */
    getStatus: (payload: EmptyPayload) => Promise<GraphicInstanceStatus>

    /**
     * Called by the Renderer to invoke an Action on the Graphic
     * @returns The return value of the invoked method (vendor-specific)
     */
    invokeAction: (payload: ActionInvokePayload) => Promise<unknown>

    /**
     * If the Graphic supports non-realtime rendering, this is called to make the graphic jump to a certain point in time.
     * @returns A Promise that resolves when the Graphic has finished rendering the requested frame.
     */
    goToTime: (payload: {
        timestamp: number
    }) => Promise<EmptyPayload>

    /**
     * If the Graphic supports non-realtime rendering, this is called to schedule actions to be invoked at a certain point in time.
     * When this is called, the Graphic is expected to store the scheduled actions and invoke them when the time comes.
     * (A call to this replaces any previous scheduled actions.)
     * @returns A Promise that resolves when the Graphic has stored the scheduled actions.
     */
    setInvokeActionsSchedule: (payload: {
        /**
         * A list of the scheduled actions to invoke at a certain point in time.
         */
        schedule: {
            timestamp: number
            invokeAction: ActionInvokePayload
        }[]
    }) => Promise<EmptyPayload>
}




/**
 * Methods called on a Renderer by the GraphicInstance
 * @throws GraphicsError
*/
export interface GraphicsRendererApi {

    /** Called when the GI has loaded all its resources and is ready to receive commands  */
    loaded: () => void
    /** Request to the Renderer to unload/kill the GraphicInstance */
    unload: () => void
    /** Inform the Renderer that the GraphicInstance status has changed */
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
        Object.setPrototypeOf(this, GraphicsError.prototype)
    }
}
