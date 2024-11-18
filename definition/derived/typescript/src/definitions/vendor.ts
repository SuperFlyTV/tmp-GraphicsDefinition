
/**
 * Vendors are encouraged to prefix any additional vendor-specific properties with
 * "_VENDORNAME" (for example "_SuperFlyFluxCapacitorStatus") to ensure forward compatibility
 */
export type VendorSpecific = `_${VendorName}${string}`
type VendorName = string
