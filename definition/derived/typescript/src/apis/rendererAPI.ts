import { GraphicInvokePayload } from "../definitions/graphic"
import {
    EmptyPayload,
    GraphicInstance,
    RendererInfo,
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
 * The WebSocket connection is opened by the Renderer to the Server.
 * The Renderer MUST send a "register" message after opening the connection.
 * Upon shutdown, the Renderer SHOULD send a "unregister" message before closing the connection.
 *
 * The Server MUST accept websocket connections on the path "/rendererApi/v1"
 * The Server SHOULD accept websocket connections on the port 80 / 443 (but other ports are allowed)
 * ================================================================================================
*/


/**
 * Methods called by the Server (sent to the Renderer)
 * The methods are invoked using JSON-RPC 2.0 over WebSocket
*/
export interface MethodsOnRenderer {
    getManifest: (params: EmptyPayload) => PromiseLike<RendererInfo & RendererManifest>
    listGraphicInstances: (params: EmptyPayload) => PromiseLike<GraphicInstance[]>
    getStatus: (params: EmptyPayload) => PromiseLike<RendererStatus>
    getTargetStatus: (params: { renderTargetId: string } & EmptyPayload) => PromiseLike<RenderTargetStatus>
    /** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
    loadGraphic: (params: { renderTargetId: string } & RenderTargetLoadGraphicPayload) => PromiseLike<void>
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    clearGraphic: (params: { renderTargetId: string } & RenderTargetClearGraphicPayload) => PromiseLike<void>
    /** Invokes an action on the graphic */
    invokeGraphic: (params: { renderTargetId: string } & GraphicInvokePayload) => PromiseLike<void>
}

/**
 * Methods called by the Renderer (sent to the Server)
 * The methods are invoked using JSON-RPC 2.0 over WebSocket
 */
export interface MethodsOnServer {
    /**
     * MUST be emitted when the Renderer has spawned and is ready to receive commands.
     * Payload:
     * Partial<RendererInfo>
    */
    register: (payload: { info: Partial<RendererInfo> }) => PromiseLike<void>
    /** CAN be emitted when a Renderer is about to shut down. */
    unregister: () => PromiseLike<void>
    /** CAN be emitted when the status changes */
    status: (payload: { status: RendererStatus }) => PromiseLike<void>
    /** CAN be emitted with debugging info (for developers) */
    debug: (payload: { message: string }) => PromiseLike<void>
}
