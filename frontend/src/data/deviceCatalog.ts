export interface DeviceSeriesGroup {
  name: string;
  models: string[];
}

export interface BrandCatalog {
  label: string;
  popular: string[];
  series: DeviceSeriesGroup[];
}

export type BrandKey =
  | "apple"
  | "samsung"
  | "oneplus"
  | "pixel"
  | "vivo"
  | "xiaomi"
  | "other";

export const PART_GRADES = ["OEM Service Pack", "Premium OLED/Grade"] as const;
export type PartGrade = (typeof PART_GRADES)[number];

export const SOCIETY_QUICK_CHIPS = [
  "Lanco Hills, Manikonda",
  "Alkapur Township, Puppalaguda",
  "OU Colony, Shaikpet",
  "Telecom Nagar / DLF, Gachibowli",
  "My Home Avatar, Narsingi",
] as const;

export const DEVICE_CATALOG: Record<BrandKey, BrandCatalog> = {
  apple: {
    label: "Apple (iPhone)",
    popular: ["iPhone 16 Pro Max", "iPhone 16", "iPhone 15 Pro", "iPhone 14", "iPhone 13"],
    series: [
      {
        name: "iPhone 16 & 15 Series",
        models: [
          "iPhone 16 Pro Max",
          "iPhone 16 Pro",
          "iPhone 16 Plus",
          "iPhone 16",
          "iPhone 16e",
          "iPhone 15 Pro Max",
          "iPhone 15 Pro",
          "iPhone 15 Plus",
          "iPhone 15",
        ],
      },
      {
        name: "iPhone 14, 13 & 12 Series",
        models: [
          "iPhone 14 Pro Max",
          "iPhone 14 Pro",
          "iPhone 14 Plus",
          "iPhone 14",
          "iPhone 13 Pro Max",
          "iPhone 13 Pro",
          "iPhone 13",
          "iPhone 13 mini",
          "iPhone 12 Pro Max",
          "iPhone 12 Pro",
          "iPhone 12",
          "iPhone 12 mini",
        ],
      },
      {
        name: "iPhone 11, X & SE Series",
        models: [
          "iPhone 11 Pro Max",
          "iPhone 11 Pro",
          "iPhone 11",
          "iPhone SE (3rd Gen)",
          "iPhone SE (2nd Gen)",
          "iPhone XS Max",
          "iPhone XR",
        ],
      },
    ],
  },
  samsung: {
    label: "Samsung Galaxy",
    popular: ["Galaxy S25 Ultra", "Galaxy S24 Ultra", "Galaxy S23", "Galaxy Z Flip 6", "Galaxy A55 5G"],
    series: [
      {
        name: "S & Note Series",
        models: [
          "Galaxy S25 Ultra",
          "Galaxy S25+",
          "Galaxy S25",
          "Galaxy S24 Ultra",
          "Galaxy S24+",
          "Galaxy S24",
          "Galaxy S24 FE",
          "Galaxy S23 Ultra",
          "Galaxy S23+",
          "Galaxy S23",
          "Galaxy S23 FE",
          "Galaxy S22 Ultra",
          "Galaxy S22+",
          "Galaxy S22",
          "Galaxy S21 FE",
          "Galaxy Note 20 Ultra",
        ],
      },
      {
        name: "Z Fold & Flip Series",
        models: [
          "Galaxy Z Fold 6",
          "Galaxy Z Flip 6",
          "Galaxy Z Fold 5",
          "Galaxy Z Flip 5",
          "Galaxy Z Fold 4",
          "Galaxy Z Flip 4",
        ],
      },
      {
        name: "A, M & F Series",
        models: [
          "Galaxy A55 5G",
          "Galaxy A54 5G",
          "Galaxy A53 5G",
          "Galaxy A35 5G",
          "Galaxy A34 5G",
          "Galaxy A25 5G",
          "Galaxy A16 5G",
          "Galaxy A15 5G",
          "Galaxy M55 5G",
          "Galaxy M35 5G",
          "Galaxy M34 5G",
          "Galaxy F55 5G",
          "Galaxy F54 5G",
        ],
      },
    ],
  },
  oneplus: {
    label: "OnePlus",
    popular: ["OnePlus 13", "OnePlus 13R", "OnePlus 12R", "OnePlus 11", "OnePlus Nord 4"],
    series: [
      {
        name: "Flagship & R Series",
        models: [
          "OnePlus 13",
          "OnePlus 13R",
          "OnePlus 12",
          "OnePlus 12R",
          "OnePlus 11",
          "OnePlus 11R",
          "OnePlus 10 Pro",
          "OnePlus 10R",
          "OnePlus 10T",
          "OnePlus 9 Pro",
          "OnePlus 9R",
          "OnePlus 9",
          "OnePlus 8T",
          "OnePlus Open",
        ],
      },
      {
        name: "Nord Series",
        models: [
          "OnePlus Nord 4",
          "OnePlus Nord CE 4",
          "OnePlus Nord CE 4 Lite",
          "OnePlus Nord 3",
          "OnePlus Nord CE 3",
          "OnePlus Nord CE 3 Lite",
          "OnePlus Nord 2T",
          "OnePlus Nord 2",
        ],
      },
    ],
  },
  pixel: {
    label: "Google Pixel",
    popular: ["Pixel 9 Pro XL", "Pixel 9", "Pixel 8a", "Pixel 8", "Pixel 7a"],
    series: [
      {
        name: "Pixel 9 & 8 Series",
        models: [
          "Pixel 9 Pro XL",
          "Pixel 9 Pro",
          "Pixel 9",
          "Pixel 9 Pro Fold",
          "Pixel 8 Pro",
          "Pixel 8",
          "Pixel 8a",
        ],
      },
      {
        name: "Pixel 7 & 6 Series",
        models: [
          "Pixel 7 Pro",
          "Pixel 7",
          "Pixel 7a",
          "Pixel 6 Pro",
          "Pixel 6",
          "Pixel 6a",
        ],
      },
    ],
  },
  vivo: {
    label: "Vivo & iQOO",
    popular: ["Vivo X200 Pro", "Vivo V40 Pro", "Vivo T3 Ultra", "iQOO 13", "iQOO Neo 9 Pro"],
    series: [
      {
        name: "Vivo X, V & T Series",
        models: [
          "Vivo X200 Pro",
          "Vivo X200",
          "Vivo X100 Pro",
          "Vivo X100",
          "Vivo X90 Pro",
          "Vivo V40 Pro",
          "Vivo V40",
          "Vivo V30 Pro",
          "Vivo V30",
          "Vivo V29 Pro",
          "Vivo V29",
          "Vivo T3 Ultra",
          "Vivo T3 Pro",
          "Vivo T3x",
          "Vivo Y200",
        ],
      },
      {
        name: "iQOO Series",
        models: [
          "iQOO 13",
          "iQOO 12",
          "iQOO 11",
          "iQOO Neo 9 Pro",
          "iQOO Neo 7 Pro",
          "iQOO Z9s Pro",
          "iQOO Z9x",
        ],
      },
    ],
  },
  xiaomi: {
    label: "Xiaomi / Redmi / POCO",
    popular: ["Xiaomi 14", "Redmi Note 14 Pro+", "Redmi Note 13 Pro+", "POCO F6", "POCO X6 Pro"],
    series: [
      {
        name: "Xiaomi Flagship",
        models: [
          "Xiaomi 14 Ultra",
          "Xiaomi 14",
          "Xiaomi 14 CIVI",
          "Xiaomi 13 Pro",
          "Xiaomi 12 Pro",
          "Xiaomi 11i HyperCharge",
        ],
      },
      {
        name: "Redmi Note & Number Series",
        models: [
          "Redmi Note 14 Pro+",
          "Redmi Note 14 Pro",
          "Redmi Note 14 5G",
          "Redmi Note 13 Pro+",
          "Redmi Note 13 Pro",
          "Redmi Note 13 5G",
          "Redmi Note 12 Pro+",
          "Redmi Note 12 Pro",
          "Redmi Note 11 Pro+",
          "Redmi 13 5G",
          "Redmi 12 5G",
        ],
      },
      {
        name: "POCO Series",
        models: [
          "POCO F6",
          "POCO F5",
          "POCO X6 Pro",
          "POCO X6",
          "POCO M6 Pro",
        ],
      },
    ],
  },
  other: {
    label: "Other Brands",
    popular: ["Nothing Phone (2a)", "Motorola Edge 50 Pro", "Realme GT 6T", "Oppo Reno 12 Pro"],
    series: [
      {
        name: "Nothing",
        models: ["Nothing Phone (2a) Plus", "Nothing Phone (2a)", "Nothing Phone (2)", "CMF Phone 1"],
      },
      {
        name: "Motorola",
        models: ["Motorola Edge 50 Pro", "Motorola Edge 50 Fusion", "Motorola Edge 40 Neo"],
      },
      {
        name: "Realme",
        models: ["Realme GT 6", "Realme GT 6T", "Realme 13 Pro+", "Realme Narzo 70 Pro"],
      },
      {
        name: "Oppo",
        models: ["Oppo Reno 12 Pro", "Oppo Reno 12", "Oppo F27 Pro+"],
      },
    ],
  },
};

export function getBrandModelCount(brandKey: BrandKey): number {
  return DEVICE_CATALOG[brandKey].series.reduce(
    (sum, group) => sum + group.models.length,
    0
  );
}

export function formatDeviceLabel(
  brandKey: BrandKey,
  model: string,
  isCustomModel: boolean
): string {
  if (isCustomModel) return model;
  if (brandKey === "apple" && !model.toLowerCase().startsWith("apple")) {
    return `Apple ${model}`;
  }
  if (brandKey === "samsung" && !model.toLowerCase().startsWith("samsung")) {
    return `Samsung ${model}`;
  }
  if (brandKey === "pixel" && !model.toLowerCase().startsWith("google")) {
    return `Google ${model}`;
  }
  return model;
}

export interface DeviceSearchHit {
  brandKey: BrandKey;
  brandLabel: string;
  model: string;
  seriesName: string;
}

export function searchDeviceModels(query: string, limit = 24): DeviceSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: DeviceSearchHit[] = [];
  for (const [bKey, bObj] of Object.entries(DEVICE_CATALOG) as [BrandKey, BrandCatalog][]) {
    for (const grp of bObj.series) {
      for (const m of grp.models) {
        const formatted = formatDeviceLabel(bKey, m, false).toLowerCase();
        if (
          m.toLowerCase().includes(q) ||
          formatted.includes(q) ||
          bObj.label.toLowerCase().includes(q) ||
          grp.name.toLowerCase().includes(q)
        ) {
          results.push({
            brandKey: bKey,
            brandLabel: bObj.label,
            model: m,
            seriesName: grp.name,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}
