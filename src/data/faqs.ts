export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "location" | "rooms" | "pricing" | "booking" | "general";
  displayOrder: number;
}

export const defaultFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where is Ardya Homestays located?",
    answer: "Ardya Homestays is nestled in Balehalli, Karnataka (PIN 577111), surrounded by lush coffee plantations of the Western Ghats. You can find turn-by-turn driving directions using our verified Google Maps link.",
    category: "location",
    displayOrder: 1,
  },
  {
    id: "faq-2",
    question: "How many rooms are available and what are the categories?",
    answer: "Ardya Homestays offers exactly 4 exclusive rooms divided into two clear categories: 1) Regular Rooms (Arabica 1 & Arabica 2) and 2) Premium Suites (Robusta Premium 1 & Robusta Premium 2).",
    category: "rooms",
    displayOrder: 2,
  },
  {
    id: "faq-3",
    question: "What is the difference between Regular and Premium rooms?",
    answer: "Regular Rooms (Arabica) are cozy, intimate rooms nestled within fragrant coffee bushes. Premium Rooms (Robusta) provide enhanced living area, comfortable seating corners, and direct access to elevated verandas overlooking panoramic estate hills.",
    category: "rooms",
    displayOrder: 3,
  },
  {
    id: "faq-4",
    question: "How much does a stay cost at Ardya Homestays?",
    answer: "Our rates are transparent and calculated on a Per Person Per Night basis: Regular Rooms (Arabica) start at ₹1,500/person for Stay Only, and ₹2,000/person with Complimentary Meals (Breakfast & Dinner). Premium Rooms (Robusta) start at ₹2,000/person for Stay Only, and ₹2,500/person with Complimentary Meals.",
    category: "pricing",
    displayOrder: 4,
  },
  {
    id: "faq-5",
    question: "What is your child pricing policy?",
    answer: "Children under 6 years stay complimentary/free with their parents. Children aged 6 to 11 years are charged at 50% of the applicable package rate. Guests aged 12 and above are charged as adults.",
    category: "pricing",
    displayOrder: 5,
  },
  {
    id: "faq-6",
    question: "What is included in the Stay with Complimentary Meals package?",
    answer: "The Complimentary Meals package includes fresh, authentic home-cooked Malnad breakfast, traditional regional dinner, freshly brewed plantation filter coffee, clean room accommodation, and 24/7 hot water.",
    category: "pricing",
    displayOrder: 6,
  },
  {
    id: "faq-7",
    question: "Is lunch included in the packages?",
    answer: "Lunch is not included in our standard packages so guests can freely explore Western Ghats sightseeing. However, lunch can be freshly arranged at the homestay upon prior request.",
    category: "pricing",
    displayOrder: 7,
  },
  {
    id: "faq-8",
    question: "How do I book a stay at Ardya Homestays?",
    answer: "You can submit an enquiry using our website's instant booking calculator, which automatically computes the price and opens WhatsApp pre-filled for direct host confirmation. You can also call us directly at 8277446061.",
    category: "booking",
    displayOrder: 8,
  },
  {
    id: "faq-9",
    question: "Are bathrooms private or shared?",
    answer: "Every single room at Ardya Homestays has its own private attached tiled washroom equipped with modern fittings, shower, and a 24/7 geyser for hot water.",
    category: "rooms",
    displayOrder: 9,
  },
  {
    id: "faq-10",
    question: "Is parking and power backup available?",
    answer: "Yes, safe vehicle parking for cars and bikes is provided free on the homestay grounds, and we have power backup for uninterrupted lighting and charging.",
    category: "general",
    displayOrder: 10,
  },
];
