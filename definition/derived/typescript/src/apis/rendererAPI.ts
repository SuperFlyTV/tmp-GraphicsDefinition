import { GraphicInvokePayload } from "../definitions/graphic"
import {
    EmptyPayload,
    GraphicInstance,
    RendererManifest,
    RendererStatus,
    RenderTargetClearGraphicPayload,
    RenderTargetLoadGraphicPayload,
    RenderTargetStatus
} from "../definitions/renderer"

/*
 * ================================================================================================
 *
 * The Renderer API is a bi-directional API over WebSocket,
 * based on JSON-RPC 2.0, https://www.jsonrpc.org/specification
 *
 *
 * ================================================================================================
*/


/**
 * Methods called by the Server (sent to the Renderer)
 * The methods are invoked using JSON-RPC 2.0 over WebSocket
*/
export interface MethodsOnRenderer {
    getManifest: (params: EmptyPayload) => RendererManifest
    listGraphicsInstances: (params: EmptyPayload) => GraphicInstance[]
    getStatus: (params: EmptyPayload) => RendererStatus
    getTargetStatus: (params: { renderTargetId: string } & EmptyPayload) => RenderTargetStatus
    /** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
    loadGraphic: (params: { renderTargetId: string } & RenderTargetLoadGraphicPayload) => void
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    clearGraphic: (params: { renderTargetId: string } & RenderTargetClearGraphicPayload) => void
    /** Invokes an action on the graphic */
    invokeGraphic: (params: { renderTargetId: string } & GraphicInvokePayload) => void
}

/**
 * Methods called by the Renderer (sent to the Server)
 * The methods are invoked using JSON-RPC 2.0 over WebSocket
 */
export interface MethodsOnServer {
    /** MUST be emitted when the Renderer has spawned and is ready to receive commands. */
    register: (payload: {rendererIn?: string}) => void
    /** CAN be emitted when a Renderer is about to shut down. */
    unregister: () => void
    /** CAN be emitted when the status changes */
    status: (payload: { status: RendererStatus}) => void
    /** CAN be emitted with debugging info (for developers) */
    debug: (payload: {message: string }) => void
}
