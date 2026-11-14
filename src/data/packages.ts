import { getActivePricingConfig, RoomCategory } from "./pricingConfig";

export interface StayPackage {
  packageId: string;
  packageName: string;
  tagline: string;
  description: string;
  regularPrice: number; // Starting rate for Regular (Arabica)
  premiumPrice: number; // Starting rate for Premium (Robusta)
  billingBasis: string;
  accommodationIncluded: boolean;
  breakfastIncluded: boolean;
  lunchIncluded: boolean;
  dinnerIncluded: boolean;
  complimentaryBreakfast: boolean;
  complimentaryDinner: boolean;
  inclusions: string[];
  exclusions: string[];
  active: boolean;
  displayOrder: number;
  badge?: string;
}

export function getStayPackages(): StayPackage[] {
  const dynamicConfig = getActivePricingConfig();

  return [
    {
      packageId: "stay-only",
      packageName: "Stay Only",
      tagline: "Pure accommodation in tranquil nature",
      description: "Comfortable homestay accommodation surrounded by coffee flora. Meals are not included.",
      regularPrice: dynamicConfig.Regular.packages["stay-only"].pricePerPerson, // 1500
      premiumPrice: dynamicConfig.Premium.packages["stay-only"].pricePerPerson, // 2000
      billingBasis: "Per Person Per Night",
      accommodationIncluded: true,
      breakfastIncluded: false,
      lunchIncluded: false,
      dinnerIncluded: false,
      complimentaryBreakfast: false,
      complimentaryDinner: false,
      inclusions: [
        "Comfortable room accommodation",
        "Attached private washroom with 24/7 hot water",
        "Access to homestay outdoor common areas & lawn",
        "Estate walk & fresh mountain air",
        "Free parking on premises",
        "Power backup & daily housekeeping",
      ],
      exclusions: [
        "Breakfast not included",
        "Lunch not included",
        "Dinner not included",
      ],
      active: true,
      displayOrder: 1,
    },
    {
      packageId: "stay-with-meals",
      packageName: "Stay with Complimentary Meals",
      tagline: "Authentic Malnad flavours included",
      description: "Comfortable homestay accommodation with freshly prepared complimentary home-cooked breakfast and dinner.",
      regularPrice: dynamicConfig.Regular.packages["stay-with-meals"].pricePerPerson, // 2000
      premiumPrice: dynamicConfig.Premium.packages["stay-with-meals"].pricePerPerson, // 2500
      billingBasis: "Per Person Per Night",
      accommodationIncluded: true,
      breakfastIncluded: true,
      lunchIncluded: false,
      dinnerIncluded: true,
      complimentaryBreakfast: true,
      complimentaryDinner: true,
      inclusions: [
        "Comfortable room accommodation",
        "Complimentary traditional breakfast",
        "Complimentary authentic dinner",
        "Morning & evening estate filter coffee",
        "Attached washroom with 24/7 hot water",
        "Access to homestay outdoor verandas & bonfire lawn",
        "Free parking on premises",
        "Power backup",
      ],
      exclusions: [
        "Lunch not included (available on prior request)",
      ],
      active: true,
      displayOrder: 2,
      badge: "Most Popular",
    },
  ];
}

export const defaultPackages: StayPackage[] = getStayPackages();
