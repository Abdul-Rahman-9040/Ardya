import { RoomCategory, CoffeeVariety } from "./pricingConfig";
import { propertyPhotos } from "./propertyPhotos";

export interface Room {
  id: string;
  name: string;
  category: RoomCategory; // "Regular" | "Premium"
  variety: CoffeeVariety; // "Arabica" | "Robusta"
  slug: string;
  startingPrice: number;
  shortDescription: string;
  longDescription: string;
  capacity: {
    baseGuests: number;
    maxGuests: number;
    bedConfiguration: string;
  };
  amenities: string[];
  bathroomDetails: string;
  coverImage: string;
  galleryImages: string[];
  active: boolean;
  displayOrder: number;
}

export const defaultRooms: Room[] = [
  // 1. REGULAR ROOMS (Coffee Variety: Arabica)
  {
    id: "arabica-1",
    name: "Arabica 1",
    category: "Regular",
    variety: "Arabica",
    slug: "regular",
    startingPrice: 1500,
    shortDescription: "Cozy Regular room enveloped by fragrant Arabica coffee bushes and gentle plantation breeze.",
    longDescription: "Arabica 1 is our quintessential Regular Room offering a peaceful, restful haven amidst Balehalli's lush greenery. Featuring large windows that invite abundant natural daylight and misty morning breezes, this room blends natural rustic elegance with clean modern essentials.",
    capacity: {
      baseGuests: 2,
      maxGuests: 4,
      bedConfiguration: "Queen bed with plush linen + extra bedding on request",
    },
    amenities: [
      "Attached private tiled washroom",
      "24/7 Geyser hot water facility",
      "Daily room housekeeping",
      "Fresh morning plantation coffee",
      "Plush clean towels & toiletries",
      "Power backup",
      "Garden & plantation views",
    ],
    bathroomDetails: "Private attached tiled washroom with hot & cold water shower and modern sanitaryware.",
    coverImage: propertyPhotos.rooms["arabica-1"].cover,
    galleryImages: propertyPhotos.rooms["arabica-1"].gallery,
    active: true,
    displayOrder: 1,
  },
  {
    id: "arabica-2",
    name: "Arabica 2",
    category: "Regular",
    variety: "Arabica",
    slug: "regular",
    startingPrice: 1500,
    shortDescription: "Bright and serene Regular room overlooking verdant Western Ghats coffee greenery.",
    longDescription: "Arabica 2 is an airy Regular Room tailored for couples, families, or solo wanderers seeking genuine tranquility. Finished in warm wood tones and understated earthy aesthetics, it offers a calming sanctuary after exploring Balehalli's waterfalls and mountain trails.",
    capacity: {
      baseGuests: 2,
      maxGuests: 4,
      bedConfiguration: "Double bed + option for comfortable rollaway bedding",
    },
    amenities: [
      "Attached private washroom",
      "24/7 Hot water geyser",
      "Daily room housekeeping",
      "Complimentary morning filter coffee",
      "Fresh linen & clean towels",
      "Power backup",
      "Estate view windows",
    ],
    bathroomDetails: "Private attached washroom equipped with hot water shower and modern fixtures.",
    coverImage: propertyPhotos.rooms["arabica-2"].cover,
    galleryImages: propertyPhotos.rooms["arabica-2"].gallery,
    active: true,
    displayOrder: 2,
  },

  // 2. PREMIUM ROOMS (Coffee Variety: Robusta)
  {
    id: "robusta-premium-1",
    name: "Robusta Premium 1",
    category: "Premium",
    variety: "Robusta",
    slug: "premium",
    startingPrice: 2000,
    shortDescription: "Generous Premium suite boasting expansive windows, fine wood accents, and elevated hillside views.",
    longDescription: "Robusta Premium 1 provides an elevated homestay experience with generous living space, handcrafted wood furnishings, and panoramic perspectives of the coffee canopy. Perfect for guests seeking spacious comfort and refined plantation ambiance.",
    capacity: {
      baseGuests: 2,
      maxGuests: 5,
      bedConfiguration: "King-size bed + sofa seating / extra mattress available",
    },
    amenities: [
      "Spacious layout with seating corner",
      "En-suite premium washroom",
      "24/7 Hot water geyser",
      "Fresh hill-grown coffee & tea service",
      "Private balcony/sit-out corridor access",
      "Power backup",
      "Panoramic estate views",
    ],
    bathroomDetails: "Spacious attached modern bathroom with shower partition and hot water availability.",
    coverImage: propertyPhotos.rooms["robusta-premium-1"].cover,
    galleryImages: propertyPhotos.rooms["robusta-premium-1"].gallery,
    active: true,
    displayOrder: 3,
  },
  {
    id: "robusta-premium-2",
    name: "Robusta Premium 2",
    category: "Premium",
    variety: "Robusta",
    slug: "premium",
    startingPrice: 2000,
    shortDescription: "Refined Premium retreat offering serene vistas, king bedding, and direct proximity to outdoor verandas.",
    longDescription: "Robusta Premium 2 blends privacy with spacious luxury. Wake up to the melodies of songbirds, sip steaming Malnad filter coffee on the verandah, and enjoy peace surrounded by towering silver oak trees and robust coffee foliage.",
    capacity: {
      baseGuests: 2,
      maxGuests: 5,
      bedConfiguration: "King-size bed + extra comfortable bedding options",
    },
    amenities: [
      "Spacious premium room layout",
      "En-suite bathroom with geyser",
      "Estate view veranda access",
      "Complimentary authentic filter coffee",
      "Daily room cleaning",
      "Power backup",
      "Generous natural lighting",
    ],
    bathroomDetails: "En-suite washroom with clean tiles, hot water supply, and complete toiletries.",
    coverImage: propertyPhotos.rooms["robusta-premium-2"].cover,
    galleryImages: propertyPhotos.rooms["robusta-premium-2"].gallery,
    active: true,
    displayOrder: 4,
  },
];
