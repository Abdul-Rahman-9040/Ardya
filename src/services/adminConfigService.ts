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

export interface AdminSiteData {
  business: BusinessConfig;
  packages: StayPackage[];
  rooms: Room[];
  pricingConfig: DynamicPricingConfig;
  faqs: FAQItem[];
  lastUpdated: string;
}

export function getInitialAdminData(): AdminSiteData {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed) {
        return {
          ...parsed,
          pricingConfig: parsed.pricingConfig || getActivePricingConfig(),
          rooms: parsed.rooms || defaultRooms,
          packages: defaultPackages,
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
    faqs: defaultFAQs,
    lastUpdated: new Date().toISOString(),
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
    return true;
  } catch (e) {
    console.error("Error saving admin data:", e);
    return false;
  }
}
