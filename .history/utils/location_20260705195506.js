import dotenv from "dotenv";

dotenv.config();

export async function lookupLocation(ip) {
  // Use ipapi.is for comprehensive geolocation with security details.
  if (!ip || ip === "unknown") {
    return null;
  }

  const response = await fetch(`https://api.ipapi.is/?q=${ip}`);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data || !data.location) {
    return null;
  }

  const loc = data.location;
  const privacy = data.privacy || {};
  const abuse = data.abuse || {};
  const asn = data.asn || {};
  const company = data.company || {};

  return {
    country: loc.country || "Unknown",
    country_code: loc.country_code || "Unknown",
    region: loc.region || "Unknown",
    city: loc.city || "Unknown",
    postal: loc.postal || "Unknown",
    timezone: loc.timezone || "Unknown",
    latitude: loc.latitude || "Unknown",
    longitude: loc.longitude || "Unknown",
    isp: asn.name || company.name || "Unknown",
    asn: asn.asn || "Unknown",
    org: company.name || "Unknown",
    is_vpn: privacy.is_vpn || false,
    is_proxy: privacy.is_proxy || false,
    is_tor: privacy.is_tor || false,
    is_hosting: privacy.is_hosting || false,
    is_mobile: privacy.is_mobile || false,
    abuse_reports: abuse.total_reports || 0,
    threat_level: abuse.threat_level || "low",
  };
}
