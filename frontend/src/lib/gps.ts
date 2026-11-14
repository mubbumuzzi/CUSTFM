export const SHOP_LAT = 17.4022;
export const SHOP_LNG = 78.3888;
export const MAX_RADIUS_KM = 5.0;

export interface GpsLocationData {
  locality: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  eligible: boolean;
  eta: string;
}

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
 */
export function getEtaForDistance(distanceKm: number): string {
  if (distanceKm > MAX_RADIUS_KM) {
    return "Shop Visit Only";
  }
  if (distanceKm <= 1.5) {
    return "30 mins";
  }
  if (distanceKm <= 3.5) {
    return "45 mins";
  }
  return "45-60 mins";
}

/**
 * Local proximity fallback for Hyderabad/Manikonda area
 */
function getLocalLandmarkFallback(lat: number, lng: number): string {
  const km = calculateDistanceKm(lat, lng);
  if (km <= 1.0) return "Manikonda Main Rd, Hyderabad";
  if (km <= 1.8) return "Lanco Hills, Manikonda";
  if (km <= 2.8) return "Puppalaguda, Hyderabad";
  if (km <= 3.8) return "Alkapoor Township, Manikonda";
  if (km <= 5.0) return "OU Colony / Shaikpet, Hyderabad";
  if (km <= 7.0) return "Gachibowli, Hyderabad";
  if (km <= 10.0) return "Hitec City, Hyderabad";
  return `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

/**
 * Reverse geocodes coordinates to a human-readable locality string
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // Use AbortController with 3.5s timeout so reverse geocode never blocks or hangs
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        signal: controller.signal,
        headers: { "Accept-Language": "en" },
      }
    );
    clearTimeout(timer);

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
        addr.county;
      const city = addr.city || addr.town || addr.state_district || "Hyderabad";

      if (locality) {
        return `${locality}, ${city}`;
      }
    }
  } catch (err) {
    clearTimeout(timer);
    console.warn("Reverse geocode fetch failed or timed out, using fallback:", err);
  }

  return getLocalLandmarkFallback(lat, lng);
}

/**
 * Actively queries device GPS and resolves full doorstep eligibility
 */
export function detectGpsLocation(): Promise<GpsLocationData> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const distanceKm = calculateDistanceKm(latitude, longitude);
          const locality = await reverseGeocode(latitude, longitude);
          const eligible = distanceKm <= MAX_RADIUS_KM;
          const eta = getEtaForDistance(distanceKm);

          const result: GpsLocationData = {
            locality,
            distanceKm,
            latitude,
            longitude,
            eligible,
            eta,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem("fm_user_locality", locality);
            localStorage.setItem("fm_user_distance", String(distanceKm));
            localStorage.setItem("fm_user_lat", String(latitude));
            localStorage.setItem("fm_user_lng", String(longitude));
            localStorage.setItem("fm_user_is_gps", "true");
            localStorage.setItem("fm_user_eligible", String(eligible));
            localStorage.setItem("fm_user_eta", eta);

            // Notify all listening components across the application
            window.dispatchEvent(
              new CustomEvent("fm_location_updated", { detail: result })
            );
          }

          resolve(result);
        } catch (e) {
          reject(e);
        }
      },
      (error) => {
        let msg = "Could not retrieve GPS coordinates.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location in your browser or select below.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS location unavailable on this device.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
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
  const distanceStr = localStorage.getItem("fm_user_distance");
  const isGpsStr = localStorage.getItem("fm_user_is_gps");
  const eligibleStr = localStorage.getItem("fm_user_eligible");
  const etaStr = localStorage.getItem("fm_user_eta");

  if (!locality && !distanceStr) return null;

  const distanceKm = distanceStr ? parseFloat(distanceStr) : 0;
  return {
    locality: locality || undefined,
    distanceKm: isNaN(distanceKm) ? 0 : distanceKm,
    eligible: eligibleStr === "true",
    eta: etaStr || getEtaForDistance(distanceKm),
  };
}
