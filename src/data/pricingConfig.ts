// CENTRALIZED DYNAMIC PRICING ENGINE FOR ARDYA HOMESTAYS

export type RoomCategory = "Regular" | "Premium";
export type CoffeeVariety = "Arabica" | "Robusta";
export type PackageType = "stay-only" | "stay-with-meals";

export interface CategoryPricingConfig {
  category: RoomCategory;
  variety: CoffeeVariety;
  startingPrice: number; // base starting price (Stay Only)
  packages: {
    "stay-only": {
      name: string;
      pricePerPerson: number;
      tagline: string;
      description: string;
      inclusions: string[];
    };
    "stay-with-meals": {
      name: string;
      pricePerPerson: number;
      tagline: string;
      description: string;
      inclusions: string[];
    };
  };
}

export interface DynamicPricingConfig {
  Regular: CategoryPricingConfig;
  Premium: CategoryPricingConfig;
  childPricingPolicy: {
    freeUnderAge: number; // Below 6 is complimentary/free
    childChargePercentage: number; // 6-11 years pay 50% of adult rate
    adultFromAge: number; // 12+ is standard chargeable adult
  };
  lastUpdated: string;
}

export const defaultPricingConfig: DynamicPricingConfig = {
  Regular: {
    category: "Regular",
    variety: "Arabica",
    startingPrice: 1500,
    packages: {
      "stay-only": {
        name: "Stay Only",
        pricePerPerson: 1500,
        tagline: "Pure accommodation in tranquil nature",
        description: "Comfortable homestay room in our Arabica regular rooms. Room stay only; meals not included.",
        inclusions: [
          "Comfortable room accommodation",
          "Attached private washroom with 24/7 hot water",
          "Access to garden verandas & plantation grounds",
          "Safe vehicle parking on premises",
          "Power backup & daily housekeeping",
        ],
      },
      "stay-with-meals": {
        name: "Stay with Complimentary Meals",
        pricePerPerson: 2000,
        tagline: "Authentic Malnad breakfast & dinner included",
        description: "Arabica regular room accommodation with freshly prepared home-cooked breakfast & dinner.",
        inclusions: [
          "Comfortable room accommodation",
          "Complimentary Malnad home breakfast",
          "Complimentary authentic regional dinner",
          "Fresh plantation filter coffee",
          "Attached washroom with 24/7 hot water",
          "Access to common verandas & bonfire lawn",
          "Safe vehicle parking & power backup",
        ],
      },
    },
  },
  Premium: {
    category: "Premium",
    variety: "Robusta",
    startingPrice: 2000,
    packages: {
      "stay-only": {
        name: "Stay Only",
        pricePerPerson: 2000,
        tagline: "Spacious premium luxury amidst coffee flora",
        description: "Spacious Robusta premium suite with enhanced living area and elevated views. Accommodation only.",
        inclusions: [
          "Spacious premium suite accommodation",
          "En-suite premium washroom with 24/7 hot water",
          "Direct access to private view veranda",
          "Estate walk & fresh mountain air",
          "Safe vehicle parking on premises",
          "Power backup & premium room service",
        ],
      },
      "stay-with-meals": {
        name: "Stay with Complimentary Meals",
        pricePerPerson: 2500,
        tagline: "Full gourmet Malnad hospitality in premium suite",
        description: "Robusta premium suite accommodation inclusive of fresh local breakfast and traditional dinner.",
        inclusions: [
          "Spacious premium suite accommodation",
          "Complimentary traditional Malnad breakfast",
          "Complimentary gourmet home-style dinner",
          "Fresh hill-grown filter coffee & tea service",
          "En-suite washroom with 24/7 hot water",
          "Veranda access overlooking coffee hills",
          "Evening campfire sit-out access",
          "Safe vehicle parking & power backup",
        ],
      },
    },
  },
  childPricingPolicy: {
    freeUnderAge: 6,
    childChargePercentage: 0.5, // 50% charge for children 6-11
    adultFromAge: 12,
  },
  lastUpdated: new Date().toISOString(),
};

const PRICING_STORAGE_KEY = "ardya_dynamic_pricing_config";

export function getActivePricingConfig(): DynamicPricingConfig {
  try {
    const saved = localStorage.getItem(PRICING_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.Regular && parsed.Premium) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load stored dynamic pricing, falling back to defaults", e);
  }
  return defaultPricingConfig;
}

export function saveActivePricingConfig(config: DynamicPricingConfig): boolean {
  try {
    config.lastUpdated = new Date().toISOString();
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(config));
    // Trigger custom event so any active component can re-render immediately
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ardya-pricing-updated", { detail: config }));
    }
    return true;
  } catch (e) {
    console.error("Failed to save dynamic pricing config:", e);
    return false;
  }
}

export interface StayCalculationResult {
  category: RoomCategory;
  variety: CoffeeVariety;
  packageType: PackageType;
  packageName: string;
  ratePerPerson: number;
  nights: number;
  adults: number;
  children: number;
  chargeableGuests: number;
  adultsTotal: number;
  childrenTotal: number;
  totalEstimatedPrice: number;
  calculationBreakdown: string;
}

/**
 * Single centralized price calculation engine
 * Formula:
 * Total = Applicable Package Rate × Chargeable Guests × Number of Nights
 * Children (under 12): charged at 50% of adult rate (children under 6 free).
 */
export function calculateDynamicStayPrice(params: {
  category: RoomCategory;
  packageType: PackageType;
  nights: number;
  adults: number;
  children: number;
  customConfig?: DynamicPricingConfig;
}): StayCalculationResult {
  const config = params.customConfig || getActivePricingConfig();
  const categoryConfig = config[params.category] || config.Regular;
  const pkgConfig = categoryConfig.packages[params.packageType] || categoryConfig.packages["stay-only"];

  const nights = Math.max(1, params.nights || 1);
  const adults = Math.max(1, params.adults || 1);
  const children = Math.max(0, params.children || 0);

  const ratePerPerson = pkgConfig.pricePerPerson;
  const childRate = ratePerPerson * config.childPricingPolicy.childChargePercentage;

  const adultsTotal = adults * ratePerPerson * nights;
  const childrenTotal = children * childRate * nights;
  const totalEstimatedPrice = adultsTotal + childrenTotal;
  const chargeableGuests = adults + (children * config.childPricingPolicy.childChargePercentage);

  const breakdown = children > 0
    ? `${adults} Adult(s) @ ₹${ratePerPerson.toLocaleString("en-IN")} + ${children} Child(ren) @ ₹${childRate.toLocaleString("en-IN")} for ${nights} Night(s)`
    : `${adults} Adult(s) @ ₹${ratePerPerson.toLocaleString("en-IN")} for ${nights} Night(s)`;

  return {
    category: params.category,
    variety: categoryConfig.variety,
    packageType: params.packageType,
    packageName: pkgConfig.name,
    ratePerPerson,
    nights,
    adults,
    children,
    chargeableGuests,
    adultsTotal,
    childrenTotal,
    totalEstimatedPrice,
    calculationBreakdown: breakdown,
  };
}
