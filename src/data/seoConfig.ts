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
  defaultOgImage: "/images/ardya-hero-poster.jpg",
  pages: {
    home: {
      title: "Ardya Homestays | Coffee Estate Homestay in Balehalli, Chikkamagaluru",
      description: "Discover Ardya Homestays in Balehalli, Chikkamagaluru, Karnataka. 4 boutique rooms, campfire evenings, authentic Malnad cuisine, coffee estate walks, and direct booking.",
      keywords: [
        "Ardya Homestays",
        "Homestay in Balehalli",
        "Balehalli homestay",
        "Homestay in Chikkamagaluru",
        "Chikmagalur homestay",
        "Chikkamagaluru coffee estate stay",
        "Homestay in Karnataka",
        "Homestays near Mudigere",
        "Arabica rooms homestay",
        "Robusta Premium rooms homestay",
        "Plantation stay Chikmagalur",
      ],
      canonical: "/",
      ogType: "website",
    },
    about: {
      title: "About Us | Ardya Homestays – Coffee Estate Stay in Chikkamagaluru",
      description: "Learn about Ardya Homestays, a peaceful 4-room boutique homestay surrounded by coffee estates in Balehalli, Chikkamagaluru district, Karnataka.",
      keywords: [
        "About Ardya Homestays",
        "Balehalli homestay experience",
        "Karnataka plantation stay",
        "Chikmagalur homestay hosts",
      ],
      canonical: "/about",
      ogType: "website",
    },
    rooms: {
      title: "Rooms & Suites | Ardya Homestays – Arabica & Robusta Premium",
      description: "Explore our four dedicated rooms across Arabica and Robusta Premium categories. Enjoy clean attached washrooms, 24/7 hot water, and serene coffee estate views.",
      keywords: [
        "Ardya Homestay rooms",
        "Arabica homestay room",
        "Robusta Premium homestay",
        "Balehalli accommodation",
        "Chikmagalur homestay rooms",
      ],
      canonical: "/rooms",
      ogType: "website",
    },
    arabica: {
      title: "Arabica Rooms | Ardya Homestays – Balehalli, Chikkamagaluru",
      description: "Discover Arabica 1 and Arabica 2: comfortable, nature-enveloped rooms at Ardya Homestays with private washrooms and plantation vistas.",
      keywords: ["Arabica rooms Ardya Homestays", "Arabica room Balehalli", "Budget plantation homestay Chikmagalur"],
      canonical: "/rooms/arabica",
      ogType: "website",
    },
    robustaPremium: {
      title: "Robusta Premium Rooms | Ardya Homestays – Balehalli, Chikkamagaluru",
      description: "Experience Robusta Premium 1 and Robusta Premium 2 at Ardya Homestays: generous space, premium fixtures, and panoramic estate views.",
      keywords: ["Robusta Premium rooms", "Luxury homestay Balehalli", "Spacious room homestay Chikmagalur", "Premium plantation stay Karnataka"],
      canonical: "/rooms/robusta-premium",
      ogType: "website",
    },
    gallery: {
      title: "Photo Gallery | Ardya Homestays Property & Rooms",
      description: "Browse actual photographs of Ardya Homestays exterior, Arabica rooms, Robusta Premium rooms, washrooms, and surrounding estate gardens.",
      keywords: ["Ardya Homestays photos", "Balehalli homestay gallery", "property pictures Ardya", "Chikmagalur homestay photos"],
      canonical: "/gallery",
      ogType: "website",
    },
    location: {
      title: "Location & Directions | Ardya Homestays – Balehalli, Chikkamagaluru",
      description: "Get turn-by-turn Google Maps directions and travel guidance to Ardya Homestays in Balehalli near Mudigere and Chikkamagaluru, Karnataka.",
      keywords: ["Ardya Homestays location", "how to reach Balehalli homestay", "Google Maps directions Ardya", "route to Chikmagalur homestay"],
      canonical: "/location",
      ogType: "website",
    },
    travelGuide: {
      title: "Chikkamagaluru & Balehalli Travel Guide | Ardya Homestays",
      description: "Complete travel guide to Balehalli and surrounding Western Ghats attractions, Mullayanagiri, Baba Budangiri, waterfalls, weather, and Malnad culture.",
      keywords: ["Balehalli travel guide", "Chikkamagaluru travel guide", "things to do near Chikmagalur", "places to visit near Balehalli"],
      canonical: "/travel-guide",
      ogType: "article",
    },
    faq: {
      title: "FAQs | Ardya Homestays – Pricing, Rooms, Food & Policies",
      description: "Find verified answers to common questions about Ardya Homestays, our ₹1,500 and ₹2,000 packages, meal inclusions, check-in times, and campfire policies.",
      keywords: ["Ardya Homestays FAQ", "Balehalli homestay cost", "food inclusion homestay", "Chikmagalur homestay prices"],
      canonical: "/faq",
      ogType: "website",
    },
    contact: {
      title: "Contact & Booking Enquiry | Ardya Homestays – 8277446061",
      description: "Reach Ardya Homestays directly via phone or WhatsApp at +91 8277446061. Enquire about room availability, group packages, and custom dates.",
      keywords: ["Contact Ardya Homestays", "Ardya Homestay phone number", "WhatsApp booking homestay Balehalli", "Chikmagalur homestay booking"],
      canonical: "/contact",
      ogType: "website",
    },
    booking: {
      title: "Book Your Stay | Ardya Homestays – Rates & Instant Calculator",
      description: "Calculate your stay cost across our Stay Only (₹1,500) and Stay with Meals (₹2,000) packages and submit an enquiry directly.",
      keywords: ["Book homestay in Balehalli", "Homestay booking Karnataka", "Ardya Homestays rates", "Chikmagalur homestay tariff"],
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
