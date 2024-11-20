import { ActionSchema } from "./action"
import { VendorSpecific } from "./vendor"

export interface GraphicInfo
{
    // Forwarded from the Graphic Definition:
    id: string
    version: number
    name: string
    description: string
    author: string

    /**
     * true if the Graphic is a work-in-progress.
     * The intention is that the Graphic should not be used on-air.
     */
    draft: boolean

    [vendorSpecific: VendorSpecific]: unknown
}
export interface GraphicManifest
{
    // Forwarded from the Graphic Definition: --------------------------------------------
    actions: {[
        path: string
    ]: ActionSchema}

    rendering: {
        /** If the Graphic supports RealTime Rendering. */
        supportsRealTime: boolean
        /** If the Graphic supports non-RealTime Rendering. If true, the Graphic MUST expose the tick() method. */
        supportsNonRealTime: boolean
    }


    // Calculated by the Server: --------------------------------------------------------

    /** Size (in bytes) of the files in the Graphic (including manifest) */
    totalSize: number

    /** Number of the files in the Graphic (including manifest) */
    fileCount: number

    // Suggestions: ===============
    /** A hash, calculated from the files in the Graphic */
    // hash: string

    [vendorSpecific: VendorSpecific]: unknown
}

/** Payload when invoking an action in a GraphicInstance */
export interface GraphicLoadPayload {
    /** A url where to find any Graphics resources */
    baseUrl: string

    /** Whether the rendering is done in realtime or non-realtime */
    renderType: "realtime" | "non-realtime"

    [vendorSpecific: VendorSpecific]: unknown
}
/** Payload when invoking an action in a GraphicInstance */
export interface GraphicInvokePayload {
    /** Graphic method, as defined by the Graphic manifest*/
    method: string
    /** Payload to send into the method */
    payload: unknown

    [vendorSpecific: VendorSpecific]: unknown
}

