/**
 * Vendors are encouraged to prefix any additional vendor-specific properties with
 * "v_VENDORNAME" (for example "v_SuperFlyFluxCapacitorStatus") to ensure forward compatibility
 */
export type VendorSpecific = `v_${VendorName}${string}`;
type VendorName = string;
