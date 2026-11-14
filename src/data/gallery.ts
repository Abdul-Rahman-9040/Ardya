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

export const defaultGallery: GalleryItem[] = [
  // 1. Exterior
  {
    id: "ext-1",
    category: "exterior",
    title: "Ardya Homestays Main Exterior",
    imagePath: "/images/exterior/main-exterior.jpg",
    altText: "Ardya Homestays front view surrounded by green hills in Balehalli",
    caption: "The charming main building framed by natural foliage",
    displayOrder: 1,
  },
  {
    id: "ext-2",
    category: "exterior",
    title: "Building Entrance & Sit-out",
    imagePath: "/images/exterior/entrance.jpg",
    altText: "Welcoming entrance to Ardya Homestays",
    caption: "Front entrance and veranda sit-out area",
    displayOrder: 2,
  },
  {
    id: "ext-3",
    category: "exterior",
    title: "Estate Panorama",
    imagePath: "/images/exterior/surroundings.jpg",
    altText: "Balehalli misty landscape surrounding the homestay",
    caption: "Lush coffee plantation surrounding the property",
    displayOrder: 3,
  },

  // 2. Arabica
  {
    id: "ara-1",
    category: "arabica",
    title: "Arabica 1 Bedroom",
    roomAssociation: "Arabica 1",
    imagePath: "/images/arabica/arabica-1/photo-1.jpg",
    altText: "Arabica 1 room bed and cozy interior at Ardya Homestays",
    caption: "Arabica 1 - Cozy room with garden views",
    displayOrder: 4,
  },
  {
    id: "ara-2",
    category: "arabica",
    title: "Arabica 2 Bedroom",
    roomAssociation: "Arabica 2",
    imagePath: "/images/arabica/arabica-2/photo-1.jpg",
    altText: "Arabica 2 peaceful bedroom layout",
    caption: "Arabica 2 - Restful and bright accommodation",
    displayOrder: 5,
  },

  // 3. Robusta Premium
  {
    id: "rob-1",
    category: "robusta-premium",
    title: "Robusta Premium 1 Suite",
    roomAssociation: "Robusta Premium 1",
    imagePath: "/images/robusta-premium/robusta-premium-1/photo-1.jpg",
    altText: "Robusta Premium 1 spacious bedroom and seating",
    caption: "Robusta Premium 1 - Spacious luxury amidst the coffee trees",
    displayOrder: 6,
  },
  {
    id: "rob-2",
    category: "robusta-premium",
    title: "Robusta Premium 2 Interior",
    roomAssociation: "Robusta Premium 2",
    imagePath: "/images/robusta-premium/robusta-premium-2/photo-1.jpg",
    altText: "Robusta Premium 2 room view with plantation windows",
    caption: "Robusta Premium 2 - Comfort with panoramic plantation vistas",
    displayOrder: 7,
  },

  // 4. Washrooms
  {
    id: "wash-1",
    category: "washrooms",
    title: "En-suite Washroom",
    roomAssociation: "Arabica / Robusta",
    imagePath: "/images/washrooms/bathroom-1.jpg",
    altText: "Clean and modern private attached bathroom with shower",
    caption: "Hygienic attached bathroom with hot water facility",
    displayOrder: 8,
  },

  // 5. Additional / Outdoor & Dining
  {
    id: "out-1",
    category: "outdoor",
    title: "Veranda & Outdoor Spaces",
    imagePath: "/images/outdoor/patio.jpg",
    altText: "Veranda overlooking coffee plantation",
    caption: "Sit-out areas designed to immerse in pure fresh air",
    displayOrder: 9,
  },
  {
    id: "din-1",
    category: "dining",
    title: "Dining Area & Home Meals",
    imagePath: "/images/dining/dining-space.jpg",
    altText: "Homestay dining space serving authentic Malnad food",
    caption: "Warm dining space for freshly prepared local meals",
    displayOrder: 10,
  },
];
