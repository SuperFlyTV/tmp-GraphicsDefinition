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


/** Methods called by the Server (sent to the Renderer) */
interface MethodsOnRenderer {
    getManifest: (payload: EmptyPayload) => RendererManifest | ErrorResponse
    listGraphicsInstances: (payload: EmptyPayload) => GraphicInstance[] | ErrorResponse
    getStatus: (payload: EmptyPayload) => RendererStatus | ErrorResponse
    getTargetStatus: (payload: { renderTargetId: string } & EmptyPayload) => RenderTargetStatus | ErrorResponse
    /** Instantiate a Graphic on a RenderTarget. Returns when the load has finished. */
    loadGraphic: (payload: { renderTargetId: string } & RenderTargetLoadGraphicPayload) => undefined | ErrorResponse
    /** Clear/unloads a GraphicInstance on a RenderTarget */
    clearGraphic: (payload: { renderTargetId: string } & RenderTargetClearGraphicPayload) => undefined | ErrorResponse
    /** Invokes an action on the graphic */
    invokeGraphic: (payload: { renderTargetId: string } & GraphicInvokePayload) => unknown | ErrorResponse
}

/** Methods called by the Renderer (sent to the Server) */
interface MethodsOnServer {
    /** MUST be emitted when the Renderer has spawned and is ready to receive commands. */
    register: (payload: {rendererIn?: string}) => undefined | ErrorResponse
    /** CAN be emitted when a Renderer is about to shut down. */
    unregister: () => undefined | ErrorResponse
    /** CAN be emitted when the status changes */
    status: (payload: { status: RendererStatus}) => undefined | ErrorResponse
    /** CAN be emitted with debugging info (for developers) */
    debug: (payload: {message: string }) => undefined | ErrorResponse
}


export interface ErrorResponse {
    errorCode: number
    errorMessage: string
}


/** The message sent over WebSocket, from the Server to the Renderer */
export type MessagesToRenderer<Action extends keyof MethodsOnRenderer> = {
    /** A unique command id */
    cmd: number
    action: Action
    payload: Parameters<MethodsOnRenderer[Action]>[0]
} | {
    // A Reply to a message
    /** The command we're replying to */
    replyTo: number
    replyAction: Action
    /**  */
    reply: ReturnType<MethodsOnRenderer[Action]>
}

/** The message sent over WebSocket, from the Renderer to the Server */
export type MessagesToServer<Action extends keyof MethodsOnServer> = {
    /** A unique command id */
    cmd: number
    action: Action
    payload: Parameters<MethodsOnServer[Action]>[0]
} | {
    // A Reply to a message
    /** The command we're replying to */
    replyTo: number
    replyAction: Action
    /**  */
    reply: ReturnType<MethodsOnServer[Action]>
}
