import React, { useState } from "react";
import { Link } from "react-router-dom";
import { businessConfig } from "../data/businessConfig";
import { defaultRooms } from "../data/rooms";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";
import { GoogleMapEmbed } from "../components/common/GoogleMapEmbed";
import { BookingForm } from "../components/booking/BookingForm";
import { RegularVsPremiumComparison } from "../components/home/RegularVsPremiumComparison";
import {
  WeatherPill,
  DayInTheLifeTimeline,
  DriveTimeCalculator,
  PackageComparisonTable,
} from "../components/home/ModernHospitalityFeatures";
import { FiveDayTravelItinerary } from "../components/home/FiveDayTravelItinerary";
import { HomeFAQSection } from "../components/home/HomeFAQSection";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Coffee,
  BedDouble,
  Navigation,
  Sunrise,
  Flame,
  Heart,
  Calendar,
} from "lucide-react";
import { RoomCategory } from "../data/pricingConfig";

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>("Regular");

  return (
    <div className="overflow-x-hidden selection:bg-[#C39A58] selection:text-[#234B36] w-full">
      <SEO
        title="Ardya Homestays | Boutique Coffee Estate Homestay in Balehalli, Karnataka"
        description="Experience Ardya Homestays in Balehalli, Karnataka. 4 exclusive rooms in two clear categories: Regular (Arabica from ₹1,500) and Premium (Robusta from ₹2,000). Direct host confirmation on WhatsApp."
        canonical="/"
      />

      {/* SECTION 1: LUXURY HERO */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-[#234B36] text-white overflow-hidden w-full">
        <div className="absolute inset-0 bg-[radial-gradient(#536B45_1px,transparent_1px)] [background-size:24px_24px] opacity-25 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#234B36] via-[#234B36]/70 to-black/50 z-10" />

        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/images/exterior/main-exterior.jpg"
            alt="Ardya Homestays coffee estate aerial Balehalli"
            fallbackTitle="Ardya Homestays Main Exterior"
            categoryName="Balehalli, Karnataka"
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
          <div className="flex items-center justify-center space-x-2 mb-5">
            <WeatherPill />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#FAF8F2] mb-4">
            Discover Serenity at <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF8F2] via-[#C39A58] to-[#FAF8F2]">
              Ardya Homestays
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#E5E4DC]/90 max-w-xl mx-auto leading-relaxed mb-8">
            An intimate coffee plantation sanctuary in Balehalli, Karnataka. 4 serene rooms across Regular &amp; Premium categories with warm campfire nights and authentic Malnad hospitality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#instant-enquiry"
              className="px-6 py-3.5 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center space-x-2 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Stay</span>
            </a>

            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center space-x-2 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Host</span>
            </a>

            <a
              href={`tel:${businessConfig.phone}`}
              className="px-5 py-3.5 border border-white/40 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>{businessConfig.displayPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: EXPERIENCE RIBBON */}
      <section className="py-4 bg-white border-b border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2 p-1">
              <Sunrise className="w-4 h-4 text-[#C39A58] shrink-0" />
              <span className="font-semibold text-[#26332A]">Misty Hill Mornings</span>
            </div>
            <div className="flex items-center space-x-2 p-1">
              <Coffee className="w-4 h-4 text-[#C39A58] shrink-0" />
              <span className="font-semibold text-[#26332A]">Fresh Filter Coffee</span>
            </div>
            <div className="flex items-center space-x-2 p-1">
              <Flame className="w-4 h-4 text-[#C39A58] shrink-0" />
              <span className="font-semibold text-[#26332A]">Evening Campfire</span>
            </div>
            <div className="flex items-center space-x-2 p-1">
              <Heart className="w-4 h-4 text-[#C39A58] shrink-0" />
              <span className="font-semibold text-[#26332A]">Malnad Home Meals</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NEW DEDICATED REGULAR VS PREMIUM COMPARISON SECTION */}
      <section className="py-10 sm:py-14 bg-white border-b border-[#E5E4DC]">
        <RegularVsPremiumComparison onSelectCategory={(cat) => setSelectedCategory(cat)} />
      </section>

      {/* SECTION 4: 4 GUEST ROOMS PREVIEW */}
      <section className="py-10 sm:py-12 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                Boutique Accommodation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-1">
                Our 4 Guest Rooms
              </h2>
            </div>

            {/* Category Switcher Tabs: Regular (Arabica) & Premium (Robusta) */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#E5E4DC] self-start sm:self-auto shadow-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("Regular")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  selectedCategory === "Regular"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F] hover:text-[#26332A]"
                }`}
              >
                Regular Rooms (Arabica)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("Premium")}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  selectedCategory === "Premium"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F] hover:text-[#26332A]"
                }`}
              >
                Premium Rooms (Robusta)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defaultRooms
              .filter((r) => r.category === selectedCategory)
              .map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-[#E5E4DC] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="h-60 sm:h-72 relative overflow-hidden bg-gray-100">
                      <SafeImage
                        src={room.coverImage}
                        alt={room.name}
                        fallbackTitle={room.name}
                        categoryName={room.category}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#234B36]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                        {room.category} • {room.variety}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#234B36] text-xs font-extrabold px-3 py-1 rounded-xl shadow">
                        from ₹{room.startingPrice.toLocaleString("en-IN")}/person
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-[#26332A]">
                        {room.name}
                      </h3>
                      <p className="text-xs text-[#74796F] mt-1.5 line-clamp-2 leading-relaxed">
                        {room.shortDescription}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E5E4DC] flex items-center justify-between text-xs text-[#26332A]">
                        <span className="flex items-center space-x-1.5 text-[#536B45]">
                          <BedDouble className="w-4 h-4 text-[#C39A58]" />
                          <span>{room.capacity.bedConfiguration}</span>
                        </span>
                        <span className="font-semibold text-[#234B36]">En-suite Washroom</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/booking?room=${room.id}&category=${room.category}`}
                      className="flex items-center justify-center space-x-1.5 w-full py-3 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors min-h-[44px]"
                    >
                      <span>Enquire for {room.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: 5-DAY SIGHTSEEING ITINERARY */}
      <section className="py-10 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FiveDayTravelItinerary />
        </div>
      </section>

      {/* SECTION 6: DYNAMIC INSTANT BOOKING ENGINE */}
      <section id="instant-enquiry" className="py-10 sm:py-12 bg-[#FAF8F2] border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <BookingForm initialCategory={selectedCategory} />
        </div>
      </section>

      {/* SECTION 7: DAY IN THE LIFE AT ARDYA */}
      <section className="py-10 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <DayInTheLifeTimeline />
        </div>
      </section>

      {/* SECTION 8: PACKAGE COMPARISON TABLE */}
      <section className="py-10 sm:py-12 bg-[#FAF8F2] border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <PackageComparisonTable />
        </div>
      </section>

      {/* SECTION 9: ROAD TRIP NAVIGATOR */}
      <section className="py-10 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <DriveTimeCalculator />
        </div>
      </section>

      {/* SECTION 10: INTERACTIVE FAQS SECTION */}
      <HomeFAQSection />

      {/* SECTION 11: GOOGLE MAP & LOCATION */}
      <section className="py-10 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                Verified Location
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-1">
                Find Us on Google Maps
              </h2>
            </div>
            <a
              href={businessConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#234B36] hover:text-[#C39A58] min-h-[44px] py-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Driving Directions</span>
            </a>
          </div>

          <GoogleMapEmbed
            title="Ardya Homestays, Balehalli"
            subtitle="Verified Google Maps Pin"
            heightClass="h-[360px] sm:h-[400px]"
            showCard={false}
          />

          <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#C39A58] shrink-0" />
              <span className="text-[#74796F]">{businessConfig.fullAddressNote}</span>
            </div>
            <a
              href={`tel:${businessConfig.phone}`}
              className="text-[#234B36] font-bold hover:underline shrink-0 min-h-[44px] flex items-center"
            >
              Call for route assistance: {businessConfig.displayPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
