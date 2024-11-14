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

export const ServerApiPaths = {
    GetListGraphics: () => `/graphics/list`,
    GetGraphicManifest: (id: string, version: string) => `/graphics/graphic/${id}/${version}/manifest`,
    GetGraphicResource: (id: string, version: string, localPath: string) => `/graphics/graphic/${id}/${version}/resource/${localPath}`,
    PutGraphicUpload: (id: string, version: string) => `/graphics/graphic/${id}/${version}`,
    GetRenderersList: () => `/renderers/list`,
    GetRendererManifest: (id: string) => `/renderers/renderer/${id}/manifest`,
    GetRenderTargetListGraphicInstances: (id: string) => `/renderers/renderer/${id}/graphicsInstances`,
    GetRendererStatus: (id: string) => `/renderers/renderer/${id}/status`,
    GetRenderTargetStatus: (id: string, target: string) => `/renderers/renderer/${id}/target/${target}/status`,
    PutGraphicLoad: (id: string, target: string) => `/renderers/renderer/${id}/target/${target}/load`,
    PutGraphicClear: (id: string) => `/renderers/renderer/${id}/clear`,
    PutGraphicInvoke: (id: string, target: string) => `/renderers/renderer/${id}/target/${target}/invoke`,
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
    graphicManifest: GraphicInfo & GraphicManifest
    [vendorSpecific: VendorSpecific]: unknown
}
// GET /graphics/graphic/${id}/${version}/resource/${localPath} → The actual Graphic
// PUT /graphics/graphic/${id}/${version}   (upload a Graphic)

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
    info: RendererInfo
    rendererManifest: RendererManifest
    [vendorSpecific: VendorSpecific]: unknown
}
/**
 * GET /renderers/renderer/${id}/graphicsInstances
 */
export type GetRendererGraphicsInstancesBody = EmptyPayload
export interface GetRendererGraphicsInstancesReturnValue {
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
