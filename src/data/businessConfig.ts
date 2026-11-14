export interface BusinessConfig {
  name: string;
  type: string;
  tagline: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  locationReference: string;
  fullAddressNote: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalRooms: number;
  roomCategories: string[];
  currency: string;
  currencySymbol: string;
  pricingBasis: string;
  checkInTime: string;
  checkOutTime: string;
}

export const businessConfig: BusinessConfig = {
  name: "Ardya Homestays",
  type: "Homestay",
  tagline: "Experience the Serenity of Coffee Hills in Balehalli, Karnataka",
  phone: "8277446061",
  displayPhone: "+91 8277446061",
  whatsapp: "+918277446061",
  locationReference: "Balehalli, Karnataka",
  fullAddressNote: "near Sanjivini Vana, Mullunde, Baallehalli, Kelgoor post, Balehalli, Karnataka 577111",
  googleMapsUrl: "https://maps.app.goo.gl/vKvFyDTN1DZ9L2XN6?g_st=ic",
  // Standard responsive Google Maps embed query based on verified location pin
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=near+Sanjivini+Vana,+Mullunde,+Baallehalli,+Kelgoor+post,+Balehalli,+Karnataka+577111&t=&z=14&ie=UTF8&iwloc=&output=embed",
  coordinates: {
    lat: 13.0826,
    lng: 75.6415,
  },
  totalRooms: 4,
  roomCategories: ["Arabica", "Robusta Premium"],
  currency: "INR",
  currencySymbol: "₹",
  pricingBasis: "Per Person Per Night",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
};
