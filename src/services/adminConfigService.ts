import { defaultPackages, StayPackage } from "../data/packages";
import { defaultRooms, Room } from "../data/rooms";
import { defaultFAQs, FAQItem } from "../data/faqs";
import { businessConfig, BusinessConfig } from "../data/businessConfig";
import {
  defaultPricingConfig,
  DynamicPricingConfig,
  getActivePricingConfig,
  saveActivePricingConfig,
} from "../data/pricingConfig";

const CONFIG_STORAGE_KEY = "ardya_admin_config";

export interface AmenityItem {
  id: string;
  name: string;
  description: string;
  included: boolean;
  category: "Nature & Estate" | "Room Comfort" | "Food & Dining" | "Convenience";
}

export interface FoodDiningConfig {
  mealInclusionHeading: string;
  breakfastMenu: string;
  dinnerMenu: string;
  lunchPolicy: string;
  malnadSpecialties: string;
  vegNonVegAvailable: boolean;
  unlimitedFilterCoffee: boolean;
  campfireEveningIncluded: boolean;
}

export interface AdminSiteData {
  business: BusinessConfig;
  packages: StayPackage[];
  rooms: Room[];
  pricingConfig: DynamicPricingConfig;
  amenities: AmenityItem[];
  foodDining: FoodDiningConfig;
  faqs: FAQItem[];
  lastUpdated: string;
  googleAppsScriptUrl?: string;
}

export const defaultAmenities: AmenityItem[] = [
  {
    id: "amenity-1",
    name: "Working Coffee Plantation Walks",
    description: "Guided or independent strolls through Arabica and Robusta coffee estates and pepper vines.",
    included: true,
    category: "Nature & Estate",
  },
  {
    id: "amenity-2",
    name: "Evening Starlit Campfire",
    description: "Gather around our warm outdoor campfire every evening under pristine hill skies.",
    included: true,
    category: "Nature & Estate",
  },
  {
    id: "amenity-3",
    name: "24/7 Geyser Hot Water",
    description: "Instant, continuous hot water in all attached en-suite washrooms.",
    included: true,
    category: "Room Comfort",
  },
  {
    id: "amenity-4",
    name: "Authentic Malnad Home Cuisine",
    description: "Freshly prepared breakfast, lunch, and dinner using regional spices and farm produce.",
    included: true,
    category: "Food & Dining",
  },
  {
    id: "amenity-5",
    name: "Fresh Estate Filter Coffee",
    description: "Unlimited morning and evening freshly brewed coffee harvested right from local estates.",
    included: true,
    category: "Food & Dining",
  },
  {
    id: "amenity-6",
    name: "Free On-Site Vehicle Parking",
    description: "Safe and spacious private parking on premises for cars, SUVs, and motorbikes.",
    included: true,
    category: "Convenience",
  },
  {
    id: "amenity-7",
    name: "High-Speed Wi-Fi Internet",
    description: "Reliable internet connectivity for workations or staying in touch.",
    included: true,
    category: "Convenience",
  },
  {
    id: "amenity-8",
    name: "Spacious Garden Veranda",
    description: "Large covered veranda seating overlooking flowering flora and coffee plants.",
    included: true,
    category: "Room Comfort",
  },
];

export const defaultFoodDining: FoodDiningConfig = {
  mealInclusionHeading: "Authentic Malnad Regional Gastronomy",
  breakfastMenu: "Hot Akki Rotti with spicy coconut chutney, Steaming Idlis with Sambar, Neer Dosa, and fresh seasonal fruits.",
  dinnerMenu: "Traditional regional curries, fragrant rice, chapati, Malnad chicken/veg gravy, local pickles, and sweet dessert.",
  lunchPolicy: "Authentic Malnad lunch is prepared upon prior advance request for arriving guests.",
  malnadSpecialties: "Akki Rotti, Bamboo Shoot delicacies (seasonal), Kadubu, Koli Saaru (Country Chicken), and fresh estate filter coffee.",
  vegNonVegAvailable: true,
  unlimitedFilterCoffee: true,
  campfireEveningIncluded: true,
};

const DEFAULT_APPS_SCRIPT_URL =
  (import.meta as any).env?.VITE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbyPLYQx0ojWKCUyAP2jAYplnXLqKg6LOkvMP4Y_5Y-2JTu8hg5R2AZ6z-DAt6VqHmhL6Q/exec";

export function getInitialAdminData(): AdminSiteData {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed) {
        return {
          ...parsed,
          business: { ...businessConfig, ...(parsed.business || {}) },
          pricingConfig: parsed.pricingConfig || getActivePricingConfig(),
          rooms: parsed.rooms || defaultRooms,
          packages: defaultPackages,
          amenities: parsed.amenities || defaultAmenities,
          foodDining: parsed.foodDining || defaultFoodDining,
          faqs: parsed.faqs || defaultFAQs,
          googleAppsScriptUrl: parsed.googleAppsScriptUrl || DEFAULT_APPS_SCRIPT_URL,
        };
      }
    }
  } catch (e) {
    console.warn("Could not read local admin data:", e);
  }

  return {
    business: businessConfig,
    packages: defaultPackages,
    rooms: defaultRooms,
    pricingConfig: getActivePricingConfig(),
    amenities: defaultAmenities,
    foodDining: defaultFoodDining,
    faqs: defaultFAQs,
    lastUpdated: new Date().toISOString(),
    googleAppsScriptUrl: DEFAULT_APPS_SCRIPT_URL,
  };
}

export function saveAdminData(data: AdminSiteData): boolean {
  try {
    data.lastUpdated = new Date().toISOString();
    // Save to main config
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(data));
    // Also save dynamic pricing config to trigger global reactivity
    if (data.pricingConfig) {
      saveActivePricingConfig(data.pricingConfig);
    }

    // If Google Apps Script URL is set, sync to Google Sheets cloud
    if (data.googleAppsScriptUrl) {
      try {
        fetch(data.googleAppsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "saveConfig",
            config: data,
          }),
        }).catch((err) => {
          console.warn("Cloud config sync note:", err);
        });
      } catch (err) {
        console.warn("Cloud config sync error:", err);
      }
    }

    return true;
  } catch (e) {
    console.error("Error saving admin data:", e);
    return false;
  }
}

// Background Cloud Synchronizer: Checks Google Sheets for live updates
export async function fetchCloudSiteConfig(): Promise<AdminSiteData | null> {
  try {
    const scriptUrl =
      (import.meta as any).env?.VITE_APPS_SCRIPT_URL ||
      (() => {
        try {
          const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.googleAppsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
          }
        } catch {}
        return DEFAULT_APPS_SCRIPT_URL;
      })();

    if (!scriptUrl) return null;

    // Check Google Sheets in background with cache-busting
    const response = await fetch(`${scriptUrl}?action=getConfig&_t=${Date.now()}`);
    if (!response.ok) return null;

    const result = await response.json();
    if (result.success && result.config) {
      const cloudConfig: AdminSiteData = result.config;

      // Update local storage on guest's device
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cloudConfig));
      if (cloudConfig.pricingConfig) {
        saveActivePricingConfig(cloudConfig.pricingConfig);
      }

      // Dispatch global update event to re-render UI components live
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("ardya-config-updated", { detail: cloudConfig })
        );
      }

      return cloudConfig;
    }
  } catch {
    // Fails safely in background - guest seamlessly sees cached/default rates
  }
  return null;
}
