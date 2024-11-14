import { ActionSchema } from "./action"
import { GraphicInfo } from "./graphic"
import { GraphicInstanceStatus } from "./graphicInstance"
import { VendorSpecific } from "./vendor"

export interface RendererInfo {
    id: string
    name: string
    description: string

    [vendorSpecific: VendorSpecific]: unknown
}
export interface RendererManifest
{
    // Forwarded from the Renderer: -------------------------------------------------------
    actions: {[
        method: string
    ]: ActionSchema}

    // Calculated by the Server: --------------------------------------------------------

    [vendorSpecific: VendorSpecific]: unknown
}
export interface GraphicInstance {
    id: string
    graphic: GraphicInfo

    // status: any // TBD?
    [vendorSpecific: VendorSpecific]: unknown
}
export interface RendererStatus {
    // TBD
    [vendorSpecific: VendorSpecific]: unknown
}
export interface RenderTargetStatus {
    graphicInstances: {
        graphicInstance: GraphicInstance,
        status: GraphicInstanceStatus
    }[]
    // TBD
    [vendorSpecific: VendorSpecific]: unknown
}


/** This indicates that a payload is empty (but a vendor may choose to add their own vendor-specific properties) */
export interface EmptyPayload {
    [vendorSpecific: VendorSpecific]: unknown
}

export interface RenderTargetLoadGraphicPayload {
    graphic: { id: string, version: number }

    [vendorSpecific: VendorSpecific]: unknown
}
export interface RenderTargetClearGraphicPayload {
    /** (Optional) If set, apply filters to which instances to clear. If no filters are defined, ALL graphics will be cleared. */
    filters?: {
        /** (Optional) If set, will only clear instances from a certain RenderTarget*/
        renderTargetId?: string
        /** (Optional) If set, will only clear instance of a certain Graphic*/
        graphic?: {id: string, version: number}
        /** (Optional) If set, will only clear a specific graphicInstanceId */
        graphicInstanceId?: string
    }
    [vendorSpecific: VendorSpecific]: unknown
}
