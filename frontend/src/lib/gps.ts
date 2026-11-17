import { saveCustomerLocationApi, getBaseUrl } from "./api.ts";

export const SHOP_LAT = 17.4058;
export const SHOP_LNG = 78.3879;
export const MAX_RADIUS_KM = 6.0;

export interface GpsLocationData {
  areaTitle?: string;
  locality: string;
  formattedAddress?: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  eligible: boolean;
  eta: string;
  postalCode?: string;
  source?: string;
}

export interface PlaceSuggestion {
  placeId: string;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  eligible: boolean;
  eta: string;
}

const getApiBaseUrl = getBaseUrl;

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
 * Returns estimated doorstep arrival time based on distance from Manikonda shop
 * Hyperlocal scaling: immediate neighborhood (<0.5km) is 10-15 mins
 */
export function getEtaForDistance(distanceKm: number): string {
  if (distanceKm > MAX_RADIUS_KM) {
    return "Shop Visit Only";
  }
  if (distanceKm <= 0.5) {
    return "10-15 mins";
  }
  if (distanceKm <= 1.5) {
    return "15-25 mins";
  }
  if (distanceKm <= 3.0) {
    return "25-35 mins";
  }
  if (distanceKm <= 5.0) {
    return "35-45 mins";
  }
  return "45-60 mins";
}

// Verified geometric centroids for Hyderabad / Manikonda localities
// Used as geometric nearest-neighbor fallback when network is offline (NEVER blind radial scalar)
const VERIFIED_LOCALITIES = [
  { area: "Lanco Hills", suburb: "Manikonda", lat: 17.4045, lng: 78.3752, postcode: "500089" },
  { area: "Secretariat Colony", suburb: "Manikonda", lat: 17.4055, lng: 78.3768, postcode: "500089" },
  { area: "Manikonda Main Road", suburb: "Manikonda", lat: 17.4022, lng: 78.3888, postcode: "500089" },
  { area: "Puppalaguda", suburb: "Manikonda", lat: 17.4000, lng: 78.3862, postcode: "500089" },
  { area: "Alkapoor Township", suburb: "Manikonda", lat: 17.3967, lng: 78.3717, postcode: "500089" },
  { area: "Neknampur", suburb: "Manikonda", lat: 17.3892, lng: 78.3812, postcode: "500089" },
  { area: "OU Colony", suburb: "Shaikpet", lat: 17.4085, lng: 78.3980, postcode: "500008" },
  { area: "Shaikpet", suburb: "Hyderabad", lat: 17.4120, lng: 78.4050, postcode: "500008" },
  { area: "Tolichowki", suburb: "Hyderabad", lat: 17.4020, lng: 78.4110, postcode: "500008" },
  { area: "Khajaguda", suburb: "Gachibowli", lat: 17.4200, lng: 78.3680, postcode: "500075" },
  { area: "Nanakramguda", suburb: "Financial District", lat: 17.4150, lng: 78.3480, postcode: "500032" },
  { area: "Financial District", suburb: "Gachibowli", lat: 17.4180, lng: 78.3380, postcode: "500032" },
  { area: "Gachibowli", suburb: "Hyderabad", lat: 17.4400, lng: 78.3489, postcode: "500032" },
  { area: "Raidurg", suburb: "Knowledge City", lat: 17.4350, lng: 78.3800, postcode: "500081" },
  { area: "Hitec City", suburb: "Hyderabad", lat: 17.4504, lng: 78.3808, postcode: "500081" },
  { area: "Madhapur", suburb: "Hyderabad", lat: 17.4485, lng: 78.3908, postcode: "500081" },
  { area: "Jubilee Hills", suburb: "Hyderabad", lat: 17.4319, lng: 78.4073, postcode: "500033" },
  { area: "Banjara Hills", suburb: "Hyderabad", lat: 17.4156, lng: 78.4352, postcode: "500034" },
  { area: "Film Nagar", suburb: "Jubilee Hills", lat: 17.4185, lng: 78.4120, postcode: "500096" },
  { area: "Narsingi", suburb: "Hyderabad", lat: 17.3820, lng: 78.3640, postcode: "500075" },
  { area: "Kokapet", suburb: "Gandipet", lat: 17.3980, lng: 78.3280, postcode: "500075" },
  { area: "Mehdipatnam", suburb: "Hyderabad", lat: 17.3916, lng: 78.4414, postcode: "500028" },
  { area: "Attapur", suburb: "Hyderabad", lat: 17.3680, lng: 78.4280, postcode: "500048" },
  { area: "Kondapur", suburb: "Hyderabad", lat: 17.4650, lng: 78.3580, postcode: "500084" },
];

function findNearestVerifiedCentroid(lat: number, lng: number) {
  let best = VERIFIED_LOCALITIES[0];
  let minDistance = Infinity;

  for (const loc of VERIFIED_LOCALITIES) {
    const d = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
    if (d < minDistance) {
      minDistance = d;
      best = loc;
    }
  }

  return {
    areaTitle: best.area,
    locality: `${best.area}, ${best.suburb}`,
    formattedAddress: `${best.area}, ${best.suburb}, Hyderabad ${best.postcode}`,
    postalCode: best.postcode,
  };
}

/**
 * Reverse geocodes coordinates through our backend proxy with User-Agent,
 * in-memory caching, ward sanitization, and geometric centroid fallback.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GpsLocationData> {
  const distanceKm = calculateDistanceKm(lat, lng);
  const eligible = distanceKm <= MAX_RADIUS_KM;
  const eta = getEtaForDistance(distanceKm);

  // 1. Primary: Query our Spring Boot backend reverse geocode proxy
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `${getApiBaseUrl()}/public/location/reverse?lat=${lat}&lng=${lng}`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      }
    );
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return {
        areaTitle: data.areaTitle || data.locality?.split(",")[0]?.trim(),
        locality: data.locality || `${data.areaTitle}, Manikonda`,
        formattedAddress: data.formattedAddress,
        distanceKm: typeof data.distanceKm === "number" ? data.distanceKm : distanceKm,
        latitude: lat,
        longitude: lng,
        eligible: typeof data.eligible === "boolean" ? data.eligible : eligible,
        eta: data.eta || eta,
        postalCode: data.postalCode,
        source: data.source || "BACKEND_PROXY",
      };
    }
  } catch (err) {
    console.warn("Backend reverse geocode proxy unavailable, checking client fallback:", err);
  }

  // 2. Secondary fallback: High-reliability client reverse geocode
  try {
    const res = await fetch(
      `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const bdc = await res.json();
      const rawLocality = bdc.locality || bdc.city || "Manikonda";
      const cleanLocality = rawLocality.replace(/^Ward\s*\d+\s*/i, "").trim();
      const areaTitle = cleanLocality || "Manikonda";
      const locality = `${areaTitle}, ${bdc.principalSubdivision || "Hyderabad"}`;

      return {
        areaTitle,
        locality,
        formattedAddress: `${areaTitle}, Hyderabad, Telangana ${bdc.postcode || "500089"}`,
        distanceKm,
        latitude: lat,
        longitude: lng,
        eligible,
        eta,
        postalCode: bdc.postcode || "500089",
        source: "CLIENT_BDC",
      };
    }
  } catch (err) {
    console.warn("Client BDC geocode unavailable:", err);
  }

  // 3. Geometric nearest-centroid fallback (never blind radial distance)
  const centroid = findNearestVerifiedCentroid(lat, lng);
  return {
    areaTitle: centroid.areaTitle,
    locality: centroid.locality,
    formattedAddress: centroid.formattedAddress,
    distanceKm,
    latitude: lat,
    longitude: lng,
    eligible,
    eta,
    postalCode: centroid.postalCode,
    source: "GEOMETRIC_CENTROID",
  };
}

/**
 * Searches places, apartments, and landmarks for autocomplete
 */
export async function searchPlacesApi(query: string): Promise<PlaceSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `${getApiBaseUrl()}/public/location/search?query=${encodeURIComponent(query.trim())}`,
      { headers: { Accept: "application/json" } }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Search places API failed:", err);
  }

  // Local fallback search from verified localities
  const q = query.toLowerCase().trim();
  return VERIFIED_LOCALITIES.filter(
    (loc) => loc.area.toLowerCase().includes(q) || loc.suburb.toLowerCase().includes(q)
  ).map((loc) => {
    const dist = calculateDistanceKm(loc.lat, loc.lng);
    return {
      placeId: `local-${loc.area.toLowerCase().replace(/\s+/g, "-")}`,
      title: `${loc.area}, ${loc.suburb}`,
      subtitle: `Hyderabad, Telangana ${loc.postcode}`,
      latitude: loc.lat,
      longitude: loc.lng,
      distanceKm: dist,
      eligible: dist <= MAX_RADIUS_KM,
      eta: getEtaForDistance(dist),
    };
  });
}

/**
 * Actively queries device GPS with high accuracy and resolves full doorstep eligibility
 */
export function detectGpsLocation(): Promise<GpsLocationData> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser. Please search manually."));
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const locationData = await reverseGeocode(latitude, longitude);

          if (typeof window !== "undefined") {
            localStorage.setItem("fm_user_locality", locationData.locality);
            localStorage.setItem("fm_user_area_title", locationData.areaTitle || locationData.locality.split(",")[0]);
            localStorage.setItem("fm_user_distance", String(locationData.distanceKm));
            localStorage.setItem("fm_user_lat", String(latitude));
            localStorage.setItem("fm_user_lng", String(longitude));
            localStorage.setItem("fm_user_is_gps", "true");
            localStorage.setItem("fm_user_eligible", String(locationData.eligible));
            localStorage.setItem("fm_user_eta", locationData.eta);

            // Record to backend DB
            saveCustomerLocationApi({
              locality: locationData.locality,
              latitude,
              longitude,
              distanceKm: locationData.distanceKm,
              eligible: locationData.eligible,
              eta: locationData.eta,
              mobileNumber: localStorage.getItem("fm_latest_mobile") || undefined,
            }).catch((err) => console.warn("Background location persist err:", err));

            // Broadcast to Header and all listeners
            window.dispatchEvent(
              new CustomEvent("fm_location_updated", { detail: locationData })
            );
          }

          resolve(locationData);
        } catch (e) {
          reject(e);
        }
      },
      (error) => {
        let msg = "Could not retrieve GPS coordinates.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please search your area or select a neighborhood.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS position unavailable. Please search your area below.";
        } else if (error.code === error.TIMEOUT) {
          msg = "GPS request timed out. Please tap to try again or search below.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Safely reads saved location preferences from localStorage
 */
export function getStoredLocation(): Partial<GpsLocationData> | null {
  if (typeof window === "undefined") return null;
  const locality = localStorage.getItem("fm_user_locality");
  const areaTitle = localStorage.getItem("fm_user_area_title");
  const distanceStr = localStorage.getItem("fm_user_distance");
  const eligibleStr = localStorage.getItem("fm_user_eligible");
  const etaStr = localStorage.getItem("fm_user_eta");
  const latStr = localStorage.getItem("fm_user_lat");
  const lngStr = localStorage.getItem("fm_user_lng");

  if (!locality && !distanceStr) return null;

  const distanceKm = distanceStr ? parseFloat(distanceStr) : 0;
  return {
    areaTitle: areaTitle || locality?.split(",")[0]?.trim(),
    locality: locality || undefined,
    distanceKm: isNaN(distanceKm) ? 0 : distanceKm,
    latitude: latStr ? parseFloat(latStr) : undefined,
    longitude: lngStr ? parseFloat(lngStr) : undefined,
    eligible: eligibleStr === "true",
    eta: etaStr || getEtaForDistance(distanceKm),
  };
}
