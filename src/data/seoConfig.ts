export interface SEOPageConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogType: string;
}

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultOgImage: string;
  pages: Record<string, SEOPageConfig>;
}

export const seoConfig: SEOConfig = {
  siteName: "Ardya Homestays",
  siteUrl: "https://ardyahomestays.com",
  defaultOgImage: "/images/exterior/main-exterior.jpg",
  pages: {
    home: {
      title: "Ardya Homestays | Homestay in Balehalli, Karnataka",
      description: "Discover Ardya Homestays in Balehalli, Karnataka. Explore four accommodation rooms, compare stay packages with optional meal inclusions and contact us for booking enquiries.",
      keywords: [
        "Ardya Homestays",
        "Homestay in Balehalli",
        "Balehalli homestay",
        "Homestay in Karnataka",
        "Homestays near Chikkamagaluru",
        "Balehalli coffee estate stay",
        "Arabica rooms",
        "Robusta Premium rooms",
      ],
      canonical: "/",
      ogType: "website",
    },
    about: {
      title: "About Us | Ardya Homestays – Balehalli, Karnataka",
      description: "Learn about Ardya Homestays, a peaceful 4-room boutique homestay surrounded by coffee estates in Balehalli, Karnataka.",
      keywords: ["About Ardya Homestays", "Balehalli homestay experience", "Karnataka plantation stay"],
      canonical: "/about",
      ogType: "website",
    },
    rooms: {
      title: "Rooms & Suites | Ardya Homestays – Arabica & Robusta Premium",
      description: "Explore our four dedicated rooms across Arabica and Robusta Premium categories. Enjoy clean attached washrooms, geyser hot water, and serene estate views.",
      keywords: ["Ardya Homestay rooms", "Arabica homestay room", "Robusta Premium homestay", "Balehalli accommodation"],
      canonical: "/rooms",
      ogType: "website",
    },
    arabica: {
      title: "Arabica Rooms | Ardya Homestays – Balehalli",
      description: "Discover Arabica 1 and Arabica 2: comfortable, nature-enveloped rooms at Ardya Homestays with private washrooms and plantation vistas.",
      keywords: ["Arabica rooms Ardya Homestays", "Arabica room Balehalli", "Budget plantation homestay"],
      canonical: "/rooms/arabica",
      ogType: "website",
    },
    robustaPremium: {
      title: "Robusta Premium Rooms | Ardya Homestays – Balehalli",
      description: "Experience Robusta Premium 1 and Robusta Premium 2 at Ardya Homestays: generous space, premium fixtures, and panoramic estate views.",
      keywords: ["Robusta Premium rooms", "Luxury homestay Balehalli", "Spacious room homestay Karnataka"],
      canonical: "/rooms/robusta-premium",
      ogType: "website",
    },
    gallery: {
      title: "Photo Gallery | Ardya Homestays Property & Rooms",
      description: "Browse actual photographs of Ardya Homestays exterior, Arabica rooms, Robusta Premium rooms, washrooms, and surrounding estate gardens.",
      keywords: ["Ardya Homestays photos", "Balehalli homestay gallery", "property pictures Ardya"],
      canonical: "/gallery",
      ogType: "website",
    },
    location: {
      title: "Location & Directions | Ardya Homestays – Balehalli, Karnataka",
      description: "Get turn-by-turn Google Maps directions and travel guidance to Ardya Homestays in Balehalli, Karnataka.",
      keywords: ["Ardya Homestays location", "how to reach Balehalli homestay", "Google Maps directions Ardya"],
      canonical: "/location",
      ogType: "website",
    },
    travelGuide: {
      title: "Balehalli Travel Guide | Discover Scenic Karnataka with Ardya Homestays",
      description: "Complete travel guide to Balehalli and surrounding Western Ghats attractions, weather, packing tips, and local Malnad culture.",
      keywords: ["Balehalli travel guide", "things to do near Balehalli", "Karnataka homestay guide"],
      canonical: "/travel-guide",
      ogType: "article",
    },
    faq: {
      title: "FAQs | Ardya Homestays – Questions on Pricing, Rooms & Location",
      description: "Find verified answers to common questions about Ardya Homestays, our ₹1,500 and ₹2,000 packages, meal inclusions, and check-in times.",
      keywords: ["Ardya Homestays FAQ", "Balehalli homestay cost", "food inclusion homestay"],
      canonical: "/faq",
      ogType: "website",
    },
    contact: {
      title: "Contact & Booking Enquiry | Ardya Homestays – 8277446061",
      description: "Reach Ardya Homestays directly via phone or WhatsApp at 8277446061. Enquire about room availability and plan your tranquil getaway.",
      keywords: ["Contact Ardya Homestays", "Ardya Homestay phone number", "WhatsApp booking homestay Balehalli"],
      canonical: "/contact",
      ogType: "website",
    },
    booking: {
      title: "Book Your Stay | Ardya Homestays – Instant Price Calculator",
      description: "Calculate your stay cost across our Stay Only (₹1,500) and Stay with Meals (₹2,000) packages and submit an enquiry directly.",
      keywords: ["Book homestay in Balehalli", "Homestay booking Karnataka", "Ardya Homestays rates"],
      canonical: "/booking",
      ogType: "website",
    },
    privacyPolicy: {
      title: "Privacy Policy | Ardya Homestays",
      description: "Read the Privacy Policy for Ardya Homestays regarding enquiry form submissions and guest data handling.",
      keywords: ["Ardya Homestays privacy policy"],
      canonical: "/privacy-policy",
      ogType: "website",
    },
  },
};
