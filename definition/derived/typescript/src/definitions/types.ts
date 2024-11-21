import { VendorSpecific } from "./vendor"


/**
 * This indicates that a payload is empty
 * (but a vendor may choose to add their own vendor-specific properties)
 */
export type EmptyPayload = VendorExtend

/**
 * All parameters, payloads and return values can be extended with vendor-specific properties
 */
export interface VendorExtend {
    [vendorSpecific: VendorSpecific]: unknown
}


/** Payload when invoking an action of a GraphicInstance or a Renderer */
export interface ActionInvokePayload {
    /** Graphic method, as defined by the Graphic manifest*/
    method: string
    /** Payload to send into the method */
    payload: unknown

    [vendorSpecific: VendorSpecific]: unknown
}

