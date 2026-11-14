export const SHOP_LAT = 17.4022;
export const SHOP_LNG = 78.3888;
export const MAX_RADIUS_KM = 5.0;

/**
 * Calculates Haversine distance in kilometers from Famous Mobiles Manikonda shop
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number = SHOP_LAT,
  lon2: number = SHOP_LNG
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Reverse geocodes coordinates to a human-readable locality string
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        addr.quarter ||
        addr.city_district ||
        addr.county ||
        "Manikonda";
      const city = addr.city || addr.town || addr.state_district || "Hyderabad";
      return `${locality}, ${city}`;
    }
  } catch (err) {
    console.warn("Reverse geocode fetch failed, using fallback:", err);
  }
  return `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
