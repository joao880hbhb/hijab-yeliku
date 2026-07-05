import dotenv from 'dotenv';

dotenv.config();

const GEO_API = process.env.GEOLOCATION_API_URL || 'https://ipwho.is';

export async function lookupLocation(ip) {
  if (!ip || ip === 'unknown') {
    return null;
  }

  const response = await fetch(`${GEO_API}/${ip}`);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data || data.success === false) {
    return null;
  }

  return {
    country: data.country || 'Unknown',
    country_code: data.country_code || 'Unknown',
    region: data.region || 'Unknown',
    city: data.city || 'Unknown',
    postal: data.postal || 'Unknown',
    timezone: data.timezone || 'Unknown',
    latitude: data.latitude || 'Unknown',
    longitude: data.longitude || 'Unknown',
    isp: data.connection?.isp || data.isp || 'Unknown',
    asn: data.connection?.asn || 'Unknown',
    org: data.org || 'Unknown',
    connection_type: data.connection?.type || 'Unknown',
    threat: data.threat || 'Unknown',
    proxy: data.proxy || false,
  };
}
