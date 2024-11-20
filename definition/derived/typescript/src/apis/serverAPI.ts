import { GraphicInfo, GraphicInvokePayload, GraphicManifest } from "../definitions/graphic"
import {
    RendererInfo,
    RendererManifest,
    GraphicInstance,
    RendererStatus,
    RenderTargetStatus,
    RenderTargetClearGraphicPayload,
    RenderTargetLoadGraphicPayload,
    EmptyPayload
} from "../definitions/renderer"
import { VendorSpecific } from "../definitions/vendor"

/*
 * ================================================================================================
 *
 * The Server API is a HTTP REST API, exposed by the Server.
 *
 * The Server MUST serve the API on the path "/serverApi/v1"
 * The Server SHOULD serve the API on the port 80 / 443 (but other ports are allowed)
 * ================================================================================================
*/

export const ServerApiPaths = {
    GetListGraphics: () => `/serverApi/v1/graphics/list`,
    GetGraphicManifest: (id: string, version: string) => `/serverApi/v1/graphics/graphic/${id}/${version}/manifest`,
    DELETEGraphic: (id: string, version: string) => `/serverApi/v1/graphics/graphic/${id}/${version}`,
    GetGraphicResource: (id: string, version: string, localPath: string) => `/serverApi/v1/graphics/graphic/${id}/${version}/resource/${localPath}`,
    POSTGraphicUpload: () => `/serverApi/v1/graphics/graphic`,

    GetRenderersList: () => `/serverApi/v1/renderers/list`,
    GetRendererManifest: (id: string) => `/serverApi/v1/renderers/renderer/${id}/manifest`,
    GetRenderTargetListGraphicInstances: (id: string) => `/serverApi/v1/renderers/renderer/${id}/graphicInstances`,
    GetRendererStatus: (id: string) => `/serverApi/v1/renderers/renderer/${id}/status`,
    GetRenderTargetStatus: (id: string, target: string) => `/serverApi/v1/renderers/renderer/${id}/target/${target}/status`,
    PutGraphicLoad: (id: string, target: string) => `/serverApi/v1/renderers/renderer/${id}/target/${target}/load`,
    PutGraphicClear: (id: string) => `/serverApi/v1/renderers/renderer/${id}/clear`,
    PutGraphicInvoke: (id: string, target: string) => `/serverApi/v1/renderers/renderer/${id}/target/${target}/invoke`,

}

export type AnyReturnValue =
    | ErrorReturnValue
    | GetGraphicsListReturnValue
    | GetGraphicManifestReturnValue
    | GetRenderersListReturnValue
    | GetRendererManifestReturnValue
    | GetRendererGraphicInstancesReturnValue
    | GetRendererStatusReturnValue
    | GetRendererTargetStatusReturnValue
    | PutRendererTargetLoadReturnValue
    | PutRendererTargetClearReturnValue
    | PutRendererTargetInvokeReturnValue



/**
 * If there was an error when invoking a method, the body will be a JSON containing this structure.
 * @see https://www.jsonrpc.org/specification#error_object
 */
export interface ErrorReturnValue {
    code: number
    message: string
    data?: any
}

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

export interface AllEndpoints {
    'GET /serverApi/v1/graphics/list': (body: GetGraphicsListBody) => PromiseLike<GetGraphicsListReturnValue>
    'GET /serverApi/v1/graphics/graphic/:id/:version/manifest': (body: GetGraphicManifestBody) => PromiseLike<GetGraphicManifestReturnValue>
    'DELETE /serverApi/v1/graphics/graphic/:id/:version': (body: EmptyPayload) => PromiseLike<any | ErrorReturnValue>
    'GET /serverApi/v1/graphics/graphic/:id/:version/resource/:localPath': (body: EmptyPayload) => PromiseLike<any | ErrorReturnValue>
    'POST /serverApi/v1/graphics/graphic': (body: any) => PromiseLike<any | ErrorReturnValue>
    'GET /serverApi/v1/renderers/list': (body: GetRenderersListBody) => PromiseLike<GetRenderersListReturnValue>
    'GET /serverApi/v1/renderers/renderer/:id/manifest': (body: GetRendererManifestBody) => PromiseLike<GetRendererManifestReturnValue>
    'GET /serverApi/v1/renderers/renderer/:id/graphicInstances': (body: GetRendererGraphicInstancesBody) => PromiseLike<GetRendererGraphicInstancesReturnValue>
    'GET /serverApi/v1/renderers/renderer/:id/status': (body: GetRendererStatusBody) => PromiseLike<GetRendererStatusReturnValue>
    'GET /serverApi/v1/renderers/renderer/:id/target/:target/status': (body: GetRendererTargetStatusBody) => PromiseLike<GetRendererTargetStatusReturnValue>
    'PUT /serverApi/v1/renderers/renderer/:id/target/:target/load': (body: PutRendererTargetLoadBody) => PromiseLike<PutRendererTargetLoadReturnValue>
    'PUT /serverApi/v1/renderers/renderer/:id/clear': (body: PutRendererTargetClearBody) => PromiseLike<PutRendererTargetClearReturnValue>
    'PUT /serverApi/v1/renderers/renderer/:id/target/:target/invoke': (body: PutRendererTargetInvokeBody) => PromiseLike<PutRendererTargetInvokeReturnValue>

}
/**
 * A list of available graphics
 * /graphics/list
 */
export type GetGraphicsListBody = EmptyPayload
export interface GetGraphicsListReturnValue
{
    graphics: GraphicInfo[]
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * Info of a Graphic (definitions etc)
 * GET /graphics/graphic/${id}/${version}/manifest
 */
export type GetGraphicManifestBody = EmptyPayload
export interface GetGraphicManifestReturnValue {
    graphicManifest: (GraphicInfo & GraphicManifest) | undefined
    [vendorSpecific: VendorSpecific]: unknown
}
// DELETE /serverApi/v1/graphics/graphic/:id/:version': (body: EmptyPayload) => PromiseLike<any | ErrorReturnValue>
export type DELETEGraphicsBody = {
    /**
     * Whether to force deletion
     * If force is false, it is recommended that the server keeps the Graphic for a while, but unlist it.
     * This is to ensure that any currently-on-air Graphics are not affected.
     */
    force?: boolean
}

// GET /graphics/graphic/${id}/${version}/resource/${localPath} → The actual Graphic
// POST /graphics/graphic/${id}/${version}   (upload a Graphic)
/*
   Graphic is uploaded as a zip file, containing the graphic.
*/


/**
 * A list of Renderers
 * GET /renderers/list
 */
export type GetRenderersListBody = EmptyPayload
export interface GetRenderersListReturnValue {

    renderers: RendererInfo[]
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * Manifest for a Renderer
 * GET /renderers/renderer/${id}/manifest
 */
export type GetRendererManifestBody = EmptyPayload
export interface GetRendererManifestReturnValue {
    rendererManifest: (RendererInfo & RendererManifest) | undefined
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * GET /renderers/renderer/${id}/graphicInstances
 */
export type GetRendererGraphicInstancesBody = EmptyPayload
export interface GetRendererGraphicInstancesReturnValue {
    graphicInstances: GraphicInstance[]
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * GET /renderers/renderer/${id}/status
 */
export type GetRendererStatusBody = EmptyPayload
export interface GetRendererStatusReturnValue {
    status: RendererStatus
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * GET /renderers/renderer/${id}/target/${target}/status
 */
export type GetRendererTargetStatusBody = EmptyPayload
export interface GetRendererTargetStatusReturnValue {
    status: RenderTargetStatus
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * PUT /renderers/renderer/${id}/target/${target}/load
 */
export type PutRendererTargetLoadBody = RenderTargetLoadGraphicPayload
export interface PutRendererTargetLoadReturnValue {
    // nothing? just the http return code?
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * PUT /renderers/renderer/${id}/clear
 */
export type PutRendererTargetClearBody = RenderTargetClearGraphicPayload
export interface PutRendererTargetClearReturnValue {
    // nothing? just the http return code?
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * PUT /renderers/renderer/${id}/target/${target}/invoke
 */
export type PutRendererTargetInvokeBody = GraphicInvokePayload
export interface PutRendererTargetInvokeReturnValue {
    /** (optional) Value returned by the method */
    value?: any
    [vendorSpecific: VendorSpecific]: unknown
}

