import { VendorSpecific } from "./vendor"

export interface GraphicInstanceStatus {
    // TBD
    [vendorSpecific: VendorSpecific]: unknown
}
