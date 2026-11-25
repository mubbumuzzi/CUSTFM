export const BUSINESS_INFO = {
  name: "Famous Mobiles",
  alternateName: "New Famous Mobile",
  url: "https://famousmobiles.com",
  orgId: "https://famousmobiles.com/#localbusiness",
  phoneDisplay: "+91 90637 86751",
  phoneE164: "+919063786751",
  whatsappBase: "https://wa.me/919063786751",
  email: "support@famousmobiles.com",
  mapsUrl: "https://share.google/U0L5BeQxKW1dBHUbJ",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Opp%20Friends%20Colony%20Bus%20Stop%2C%20Shaikpet%20Main%20Road%2C%20Puppalaguda%2C%20Manikonda%2C%20Hyderabad%20500089&t=&z=16&ie=UTF8&iwloc=&output=embed",
  hoursDisplay: "10:00 AM – 1:00 AM",
  priceRange: "₹₹",
  address: {
    streetAddress: "Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda",
    addressLocality: "Manikonda, Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500089",
    addressCountry: "IN",
    formatted:
      "Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, Manikonda, Hyderabad, Telangana 500089",
  },
  geo: {
    latitude: "17.40580",
    longitude: "78.38790",
  },
} as const;

export interface IstParts {
  year: number;
  hour: number;
  minute: number;
}

export function getIstParts(now: Date = new Date()): IstParts {
  // Convert UTC timestamp to IST (UTC+05:30 = +330 minutes) deterministically
  const istTime = new Date(now.getTime() + 330 * 60_000);
  return {
    year: istTime.getUTCFullYear(),
    hour: istTime.getUTCHours(),
    minute: istTime.getUTCMinutes(),
  };
}

export function getIstYear(now: Date = new Date()): number {
  return getIstParts(now).year;
}

export function formatIstDateTime(input?: string | Date): string {
  const d = input instanceof Date ? input : input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export interface IstStoreStatus {
  isOpen: boolean;
  label: string;
}

export function getIstStoreStatus(now: Date = new Date()): IstStoreStatus {
  const { hour } = getIstParts(now);
  const isOpen = hour >= 10 || hour < 1;

  if (isOpen) {
    return {
      isOpen: true,
      label: "Open Now • Closes 1:00 AM",
    };
  }

  return {
    isOpen: false,
    label: "Opens Today at 10:00 AM",
  };
}

export const NEIGHBORHOOD_LINKS = [
  {
    name: "Manikonda & Lanco Hills",
    shortName: "Manikonda",
    href: "/mobile-repair-manikonda",
  },
  {
    name: "Shaikpet & Puppalaguda (Store Hub)",
    shortName: "Shaikpet & Puppalaguda",
    href: "/mobile-repair-shaikpet-puppalaguda",
  },
  {
    name: "Gachibowli & Telecom Nagar",
    shortName: "Gachibowli",
    href: "/doorstep-mobile-repair-gachibowli",
  },
  {
    name: "Narsingi & Kokapet",
    shortName: "Narsingi & Kokapet",
    href: "/mobile-repair-narsingi-kokapet",
  },
  {
    name: "Tolichowki & Paramount Hills",
    shortName: "Tolichowki",
    href: "/mobile-repair-tolichowki",
  },
] as const;

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "@id": BUSINESS_INFO.orgId,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.alternateName,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.phoneE164,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS_INFO.geo.latitude,
          longitude: BUSINESS_INFO.geo.longitude,
        },
        geoRadius: "6000",
      },
      {
        "@type": "Place",
        name: "Manikonda, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Manikonda",
      },
      {
        "@type": "Place",
        name: "Puppalaguda, Hyderabad",
      },
      {
        "@type": "Place",
        name: "Shaikpet, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Shaikpet",
      },
      { "@type": "Place", name: "Alkapur Township, Hyderabad" },
      { "@type": "Place", name: "Lanco Hills, Manikonda" },
      {
        "@type": "Place",
        name: "Tolichowki, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Toli_Chowki",
      },
      {
        "@type": "Place",
        name: "Narsingi, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Narsingi,_Ranga_Reddy",
      },
      {
        "@type": "Place",
        name: "Kokapet, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Kokapet",
      },
      { "@type": "Place", name: "Raidurg, Hyderabad" },
      {
        "@type": "Place",
        name: "Gachibowli, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Gachibowli",
      },
      { "@type": "Place", name: "Film Nagar, Hyderabad" },
      {
        "@type": "Place",
        name: "Jubilee Hills, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Jubilee_Hills",
      },
      {
        "@type": "Place",
        name: "Mehdipatnam, Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Mehdipatnam",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "01:00",
      },
    ],
    hasMap: BUSINESS_INFO.mapsUrl,
  };
}
