import { GraphicInvokeActionTarget } from "../definitions/graphic"
import {
    GraphicInstance,
    GraphicInstanceOnTarget,
    RendererClearGraphicPayload,
    RendererInfo,
    RendererLoadGraphicPayload,
    RendererManifest,
    RendererStatus,
    RenderTargetStatus
} from "../definitions/renderer"
import {
    EmptyPayload,
    ActionInvokePayload,
    VendorExtend
} from "../definitions/types"

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
 *
 * ================================================================================================
*/


/**
 * Methods called by the Server (sent to the Renderer)
 * The methods are invoked using JSON-RPC 2.0 over WebSocket
*/
export interface MethodsOnRenderer {
    getManifest: (params: EmptyPayload) => PromiseLike< { rendererManifest: RendererInfo & RendererManifest } & VendorExtend>
    // listGraphicInstances: (params: EmptyPayload) => PromiseLike<{ graphicInstances: GraphicInstance[] } & VendorExtend>
    getStatus: (params: EmptyPayload) => PromiseLike<{ rendererStatus: RendererStatus } & VendorExtend>
    getTargetStatus: (params: { renderTargetId: string } & VendorExtend) => PromiseLike<{ renderTargetStatus: RenderTargetStatus } & VendorExtend>
    /** Invokes an action on the Renderer. Actions are defined by the Renderer Manifest */
    invokeRendererAction: (params: { action: ActionInvokePayload } & VendorExtend) => PromiseLike<{ value: unknown } & VendorExtend>

    /** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
    loadGraphic: (params: { renderTargetId: string } & RendererLoadGraphicPayload) => PromiseLike<{ graphicInstanceId: string } & VendorExtend>
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    clearGraphic: (params: RendererClearGraphicPayload) => PromiseLike<{ graphicInstance: GraphicInstanceOnTarget[] } & VendorExtend>
    /** Invokes an action on a graphicInstance. Actions are defined by the Graphic's manifest */
    invokeGraphicAction: (params:
        {
            renderTargetId: string,
            target: GraphicInvokeActionTarget
            action: ActionInvokePayload

        } & VendorExtend
    ) => PromiseLike<{ value: unknown } & VendorExtend>
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
     * If the id is not set, the Server will pick an id
    */
    register: (params: { info: Partial<RendererInfo> } & VendorExtend) => PromiseLike<{ rendererId: string } & VendorExtend>
    /** CAN be emitted when a Renderer is about to shut down. */
    unregister: (params: EmptyPayload) => PromiseLike<EmptyPayload>
    /** CAN be emitted when the status changes */
    status: (params: { status: RendererStatus } & VendorExtend) => PromiseLike<EmptyPayload>
    /** CAN be emitted with debugging info (for developers) */
    debug: (params: { message: string } & VendorExtend) => PromiseLike<EmptyPayload>
}

