import { propertyPhotos } from "./propertyPhotos";

export interface GalleryItem {
  id: string;
  category: "exterior" | "arabica" | "robusta-premium" | "washrooms" | "outdoor" | "dining";
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

export const defaultGallery: GalleryItem[] = propertyPhotos.gallery.map(
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
