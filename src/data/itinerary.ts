export interface SightseeingSpot {
  name: string;
  tagline?: string;
  image?: string;
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

const dayPhoto = (day: number, filename: string) =>
  `/images/Days/Day-${day}/${filename}`;

export const ardya5DayItinerary: DayItinerary[] = [
  {
    day: 1,
    title: "Coffee Estates & Mountain Peaks",
    subtitle: "High altitudes, mountain vistas & plantation adventures",
    badge: "Highest Peak Circuit",
    coverImage: dayPhoto(1, "Mullayanagiri.jpeg"),
    description: "Scale Karnataka's highest peak, take in panoramic misty ridges, and enjoy fresh coffee stopovers and estate zip-lining.",
    spots: [
      { name: "Siri Coffee", tagline: "Iconic coffee sculpture & estate cafe", image: dayPhoto(1, "siri-mane.jpg"), category: "coffee" },
      { name: "Seethalayanagiri", tagline: "Ancient shrine with scenic valley views", image: dayPhoto(1, "Seethalayanagiri.jpg"), category: "peak" },
      { name: "Mullayanagiri Peak", tagline: "Highest peak in Karnataka (1,930 m)", image: dayPhoto(1, "Mullayanagiri.jpeg"), category: "peak" },
      { name: "Kavikal Gandi", tagline: "Misty mountain pass & viewpoint", image: dayPhoto(1, "Kavikal-Gandi.jpeg"), category: "peak" },
      { name: "Honnammanahalla Falls", tagline: "Roadside cascading waterfall", image: dayPhoto(1, "Honnamana-Halla.jpeg"), category: "falls" },
      { name: "Jerry Falls", tagline: "Forest stream & jeep trail", image: dayPhoto(1, "Jhari.jpeg"), category: "falls" },
      { name: "Bababudangiri (Datta Peeta)", tagline: "Sacred mountain range & Sufi shrine", image: dayPhoto(1, "Baba-Budangiri.jpeg"), category: "heritage" },
      { name: "Green Point View", tagline: "Endless rolling green valleys", image: dayPhoto(1, "Green-Point-View.jpg"), category: "peak" },
      { name: "Zip Line Adventure", tagline: "Fly over coffee shrubs & canopy", image: dayPhoto(1, "Zip-Line-Adventure.jpeg"), category: "adventure" },
    ],
  },
  {
    day: 2,
    title: "Kemmanagundi & Waterfalls",
    subtitle: "Royal hill stations, panoramic viewpoints & misty waterfalls",
    badge: "Hill Station & Falls",
    coverImage: dayPhoto(2, "Kemmanagundi-Hill-Station.jpeg"),
    description: "Visit cascading falls, walk royal botanical hill stations, and trek the breathtaking razor ridge of Z Point.",
    spots: [
      { name: "Deveeramma Temple", tagline: "Revered hillside hill shrine", image: dayPhoto(2, "Deviramma.jpeg"), category: "heritage" },
      { name: "Kalhatti Giri Falls", tagline: "Cascades passing Veerabhadra temple", image: dayPhoto(2, "Kalhatti-Giri.jpg"), category: "falls" },
      { name: "Rock Falls", tagline: "Natural rock water pool", image: dayPhoto(2, "Rock-Falls.jpeg"), category: "falls" },
      { name: "Kemmanagundi Hill Station", tagline: "Royal retreat of the Mysore Maharajas", image: dayPhoto(2, "Kemmanagundi-Hill-Station.jpeg"), category: "peak" },
      { name: "Raj Bhavan Point", tagline: "Panoramic sunset viewing deck", image: dayPhoto(2, "Raj-Bhavan.jpeg"), category: "peak" },
      { name: "Hebbe Falls", tagline: "Stunning two-tier jungle cascade", image: dayPhoto(2, "Hebbe-falls.jpeg"), category: "falls" },
    ],
  },
  {
    day: 3,
    title: "Lakes, Peaks & Wildlife",
    subtitle: "Tranquil waters, viewpoint ridges & jungle tiger safaris",
    badge: "Lakes & Safari",
    coverImage: dayPhoto(3, "Hirekolale-Lake.jpeg"),
    description: "Witness tranquil reflections at Hirekolale Lake, take in 360-degree views at shooting spots, and venture into the untamed Bhadra Tiger Reserve.",
    spots: [
      { name: "Hirekolale Lake", tagline: "Serene mountain lake reflecting peaks", image: dayPhoto(3, "Hirekolale-Lake.jpeg"), category: "peak" },
      { name: "Bande Kallu Gudda Peak", tagline: "Massive rock peak with 360° views", image: dayPhoto(3, "Bande-Kallu-Gudda-Peak.jpeg"), category: "adventure" },
      { name: "Mallandur Shooting Point", tagline: "Famous cinematic vantage point", image: dayPhoto(3, "Mallandur-ShootingPoint.jpeg"), category: "peak" },
      { name: "Bhadra Tiger Safari", tagline: "Spot wild tigers, leopards & elephants", image: dayPhoto(3, "Bhadra-Tiger-Safari.jpeg"), category: "wildlife" },
      { name: "Ukkuda Falls", tagline: "Hidden private jungle cascade", image: dayPhoto(3, "Ukkuda-Falls.jpeg"), category: "falls" },
    ],
  },
  {
    day: 4,
    title: "Heritage & Water Adventures",
    subtitle: "Hoysala architectural marvels & exciting lake water sports",
    badge: "Culture & Watersports",
    coverImage: dayPhoto(4, "Belur-Chennakeshava.jpeg"),
    description: "Experience the timeless stone-carved heritage of the Hoysala dynasty followed by thrilling water sports across Yagachi Dam.",
    spots: [
      { name: "Hiremagalur Temple", tagline: "Historical Kodandarama shrine", image: dayPhoto(4, "Hiremagalur-Temple.jpeg"), category: "heritage" },
      { name: "Belavadi Temple", tagline: "Trikuta temple with 108 stone pillars", image: dayPhoto(4, "Belavadi-Temple.jpeg"), category: "heritage" },
      { name: "Halebeedu (UNESCO)", tagline: "Masterpiece Hoysaleswara temple carvings", image: dayPhoto(4, "Halebeedu.jpeg"), category: "heritage" },
      { name: "Belur Chennakeshava Temple", tagline: "12th-century star-shaped architecture", image: dayPhoto(4, "Belur-Chennakeshava.jpeg"), category: "heritage" },
      { name: "Yagachi Dam", tagline: "Expansive reservoir framed by hills", image: dayPhoto(4, "Yagachi-Dam.jpeg"), category: "adventure" },
      { name: "Yagachi Water Sports", tagline: "Speed boats, jet ski & banana rides", image: dayPhoto(4, "Yagachi-Water-Sports.jpeg"), category: "adventure" },
    ],
  },
  {
    day: 5,
    title: "Adventure & Scenic Landscapes",
    subtitle: "Trekking peaks, dramatic ghat edges & cascading gorges",
    badge: "Scenic Western Ghats",
    coverImage: dayPhoto(5, "Charmadi-Ghat&Falls.jpeg"),
    description: "Close your holiday with the famous Ettina Bhuja ox-shoulder trek, the rolling hills of Devaramane, and the dramatic precipices of Charmadi Ghat.",
    spots: [
      { name: "Habby Falls", tagline: "Gentle mountain forest falls", category: "falls" },
      { name: "Ettina Bhuja Peak", tagline: "Iconic ox-shoulder ridge trek", category: "adventure" },
      { name: "Devaramane Peak", tagline: "Emerald rolling meadows & temple", category: "peak" },
      { name: "Charmadi Ghat & Falls", tagline: "Spectacular Western Ghats road gorge", image: dayPhoto(5, "Charmadi-Ghat&Falls.jpeg"), category: "falls" },
    ],
  },
];
