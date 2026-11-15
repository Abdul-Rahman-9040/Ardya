import { propertyPhotos } from "./propertyPhotos";
import { ardya5DayItinerary } from "./itinerary";

export interface GalleryItem {
  id: string;
  category:
    | "exterior"
    | "arabica"
    | "robusta-premium"
    | "washrooms"
    | "outdoor"
    | "dining"
    | "destinations";
  title: string;
  roomAssociation?: string;
  imagePath: string;
  altText: string;
  caption: string;
  displayOrder: number;
}

const isGalleryCategory = (
  category: string
): category is GalleryItem["category"] =>
  [
    "exterior",
    "arabica",
    "robusta-premium",
    "washrooms",
    "outdoor",
    "dining",
  ].includes(category);

const propertyGallery: GalleryItem[] = propertyPhotos.gallery.map(
  (item, index) => {
    if (!isGalleryCategory(item.category)) {
      throw new Error(`Unknown property photo category: ${item.category}`);
    }

    return {
      ...item,
      id: `property-photo-${index + 1}`,
      category: item.category,
      displayOrder: index + 1,
    };
  }
);

let nextDisplayOrder = propertyGallery.length + 1;
const destinationGallery: GalleryItem[] = ardya5DayItinerary.flatMap((day) =>
  day.spots
    .filter((spot): spot is typeof spot & { image: string } => Boolean(spot.image))
    .map((spot, index) => ({
      id: `day-${day.day}-spot-${index + 1}`,
      category: "destinations",
      title: spot.name,
      roomAssociation: `Day ${day.day}`,
      imagePath: spot.image,
      altText: `${spot.name} in the Western Ghats`,
      caption: spot.tagline ?? `A place to visit on day ${day.day}.`,
      displayOrder: nextDisplayOrder++,
    }))
);

export const defaultGallery = [...propertyGallery, ...destinationGallery];
