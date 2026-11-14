export interface SightseeingSpot {
  name: string;
  tagline?: string;
  image: string;
  category: "peak" | "falls" | "heritage" | "wildlife" | "adventure" | "coffee";
}

export interface DayItinerary {
  day: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  coverImage: string;
  spots: SightseeingSpot[];
}

export const ardya5DayItinerary: DayItinerary[] = [
  {
    day: 1,
    title: "Coffee Estates & Mountain Peaks",
    subtitle: "High altitudes, mountain vistas & plantation adventures",
    badge: "Highest Peak Circuit",
    coverImage: "/images/destinations/mullayanagiri.jpg",
    description: "Scale Karnataka's highest peak, take in panoramic misty ridges, and enjoy fresh coffee stopovers and estate zip-lining.",
    spots: [
      { name: "Siri Coffee", tagline: "Iconic coffee sculpture & estate cafe", image: "/images/dining/dining-space.jpg", category: "coffee" },
      { name: "Seethalayanagiri", tagline: "Ancient shrine with scenic valley views", image: "/images/destinations/betta-byraveshwara.jpg", category: "peak" },
      { name: "Mullayanagiri Peak", tagline: "Highest peak in Karnataka (1,930 m)", image: "/images/destinations/mullayanagiri.jpg", category: "peak" },
      { name: "Kavikal Gandi", tagline: "Misty mountain pass & viewpoint", image: "/images/destinations/rani-jhari.jpg", category: "peak" },
      { name: "Honnammanahalla Falls", tagline: "Roadside cascading waterfall", image: "/images/destinations/hadlu-falls.jpg", category: "falls" },
      { name: "Jerry Falls", tagline: "Forest stream & jeep trail", image: "/images/destinations/kodige-falls.jpg", category: "falls" },
      { name: "Bababudangiri (Datta Peeta)", tagline: "Sacred mountain range & Sufi shrine", image: "/images/destinations/bababudangiri.jpg", category: "heritage" },
      { name: "Green Point View", tagline: "Endless rolling green valleys", image: "/images/destinations/devaramane.jpg", category: "peak" },
      { name: "Zip Line Adventure", tagline: "Fly over coffee shrubs & canopy", image: "/images/outdoor/patio.jpg", category: "adventure" },
    ],
  },
  {
    day: 2,
    title: "Kemmanagundi & Waterfalls",
    subtitle: "Royal hill stations, panoramic viewpoints & misty waterfalls",
    badge: "Hill Station & Falls",
    coverImage: "/images/destinations/kemmanagundi.jpg",
    description: "Visit cascading falls, walk royal botanical hill stations, and trek the breathtaking razor ridge of Z Point.",
    spots: [
      { name: "Deveeramma Temple", tagline: "Revered hillside hill shrine", image: "/images/destinations/devrunda-temple.jpg", category: "heritage" },
      { name: "Kalhatti Giri Falls", tagline: "Cascades passing Veerabhadra temple", image: "/images/destinations/magajahalli-falls.jpg", category: "falls" },
      { name: "Rock Falls", tagline: "Natural rock water pool", image: "/images/destinations/kodige-falls.jpg", category: "falls" },
      { name: "Kemmanagundi Hill Station", tagline: "Royal retreat of the Mysore Maharajas", image: "/images/destinations/kemmanagundi.jpg", category: "peak" },
      { name: "Z Point Trek", tagline: "Thrilling cliff edge with deep valley vistas", image: "/images/destinations/rani-jhari.jpg", category: "adventure" },
      { name: "Raj Bhavan Point", tagline: "Panoramic sunset viewing deck", image: "/images/destinations/devaramane.jpg", category: "peak" },
      { name: "Hebbe Falls", tagline: "Stunning two-tier jungle cascade", image: "/images/destinations/hebbe-falls.jpg", category: "falls" },
    ],
  },
  {
    day: 3,
    title: "Lakes, Peaks & Wildlife",
    subtitle: "Tranquil waters, viewpoint ridges & jungle tiger safaris",
    badge: "Lakes & Safari",
    coverImage: "/images/destinations/hirekolale.jpg",
    description: "Witness tranquil reflections at Hirekolale Lake, take in 360-degree views at shooting spots, and venture into the untamed Bhadra Tiger Reserve.",
    spots: [
      { name: "Hirekolale Lake", tagline: "Serene mountain lake reflecting peaks", image: "/images/destinations/hirekolale.jpg", category: "peak" },
      { name: "Bande Kallu Gudda Peak", tagline: "Massive rock peak with 360° views", image: "/images/destinations/betta-byraveshwara.jpg", category: "adventure" },
      { name: "Mallandur Shooting Point", tagline: "Famous cinematic vantage point", image: "/images/destinations/rani-jhari.jpg", category: "peak" },
      { name: "Bhadra Tiger Safari", tagline: "Spot wild tigers, leopards & elephants", image: "/images/destinations/bhadra-safari.jpg", category: "wildlife" },
      { name: "Ukkuda Falls", tagline: "Hidden private jungle cascade", image: "/images/destinations/hadlu-falls.jpg", category: "falls" },
    ],
  },
  {
    day: 4,
    title: "Heritage & Water Adventures",
    subtitle: "Hoysala architectural marvels & exciting lake water sports",
    badge: "Culture & Watersports",
    coverImage: "/images/destinations/belur-temple.jpg",
    description: "Experience the timeless stone-carved heritage of the Hoysala dynasty followed by thrilling water sports across Yagachi Dam.",
    spots: [
      { name: "Hiremagalur Temple", tagline: "Historical Kodandarama shrine", image: "/images/destinations/sakleshwara-temple.jpg", category: "heritage" },
      { name: "Belavadi Temple", tagline: "Trikuta temple with 108 stone pillars", image: "/images/destinations/devrunda-temple.jpg", category: "heritage" },
      { name: "Halebeedu (UNESCO)", tagline: "Masterpiece Hoysaleswara temple carvings", image: "/images/destinations/halebeedu.jpg", category: "heritage" },
      { name: "Belur Chennakeshava", tagline: "12th-century star-shaped architecture", image: "/images/destinations/belur-temple.jpg", category: "heritage" },
      { name: "Yagachi Dam", tagline: "Expansive reservoir framed by hills", image: "/images/destinations/yagachi.jpg", category: "adventure" },
      { name: "Yagachi Water Sports", tagline: "Speed boats, jet ski & banana rides", image: "/images/outdoor/patio.jpg", category: "adventure" },
    ],
  },
  {
    day: 5,
    title: "Adventure & Scenic Landscapes",
    subtitle: "Trekking peaks, dramatic ghat edges & cascading gorges",
    badge: "Scenic Western Ghats",
    coverImage: "/images/destinations/ettina-bhuja.jpg",
    description: "Close your holiday with the famous Ettina Bhuja ox-shoulder trek, the rolling hills of Devaramane, and the dramatic precipices of Charmadi Ghat.",
    spots: [
      { name: "Habby Falls", tagline: "Gentle mountain forest falls", image: "/images/destinations/kodige-falls.jpg", category: "falls" },
      { name: "Ettina Bhuja Peak", tagline: "Iconic ox-shoulder ridge trek", image: "/images/destinations/ettina-bhuja.jpg", category: "adventure" },
      { name: "Devaramane Peak", tagline: "Emerald rolling meadows & temple", image: "/images/destinations/devaramane.jpg", category: "peak" },
      { name: "Charmadi Ghat & Falls", tagline: "Spectacular Western Ghats road gorge", image: "/images/destinations/rani-jhari.jpg", category: "falls" },
    ],
  },
];
