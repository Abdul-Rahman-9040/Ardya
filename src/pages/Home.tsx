import React, { useState } from "react";
import { Link } from "react-router-dom";
import { businessConfig } from "../data/businessConfig";
import { defaultRooms } from "../data/rooms";
import { defaultFAQs } from "../data/faqs";
import { SEO } from "../components/seo/SEO";
import { RoomPhotoGallery } from "../components/rooms/RoomPhotoGallery";
import { GoogleMapEmbed } from "../components/common/GoogleMapEmbed";
import { BookingForm } from "../components/booking/BookingForm";
import { RegularVsPremiumComparison } from "../components/home/RegularVsPremiumComparison";
import {
  WeatherPill,
  DayInTheLifeTimeline,
  DriveTimeCalculator,
  PackageComparisonTable,
} from "../components/home/ModernHospitalityFeatures";
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
  ChevronDown,
} from "lucide-react";
import { RoomCategory } from "../data/pricingConfig";

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>("Regular");

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": defaultFAQs.slice(0, 8).map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="overflow-x-clip selection:bg-[#C39A58] selection:text-[#234B36] w-full">
      <SEO
        title="Ardya Homestays | Coffee Estate Homestay in Balehalli, Chikkamagaluru"
        description="Experience peace at Ardya Homestays in Balehalli, Chikkamagaluru, Karnataka. 4 exclusive rooms across Regular (Arabica from ₹1,500) and Premium (Robusta from ₹2,000) with home-cooked Malnad meals, campfire, and direct host booking."
        canonical="/"
        schema={homeFaqSchema}
      />

      {/* SECTION 1: LUXURY HERO */}
      <section className="home-hero relative flex items-center justify-center bg-[#17281F] text-white overflow-hidden w-full touch-pan-y">
        <img
          src="/images/ardya-hero-poster.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="home-hero__poster pointer-events-none select-none"
        />
        <video
          className="home-hero__video hidden md:block pointer-events-none select-none"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="none"
          poster="/images/ardya-hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/ardya-drone.mp4" type="video/mp4" />
        </video>
        <div className="home-hero__overlay pointer-events-none" />

        <div className="home-hero__content relative z-20 mx-auto text-center">
          <div className="home-hero__weather flex items-center justify-center mb-5 sm:mb-7">
            <WeatherPill />
          </div>

          <p className="home-hero__eyebrow">
            A private coffee-estate retreat
          </p>

          <h1 className="home-hero__title font-serif font-extrabold text-[#FAF8F2]">
            Discover Serenity at{" "}
            <span className="home-hero__title-accent">
              Ardya Homestays
            </span>
          </h1>

          <p className="home-hero__description">
            An intimate coffee-estate sanctuary in Balehalli, Karnataka, with
            four serene rooms, warm campfire evenings, and authentic Malnad
            hospitality.
          </p>

          <div className="home-hero__actions">
            <a
              href="#instant-enquiry"
              className="home-hero__button home-hero__button--primary"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Stay</span>
            </a>

            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="home-hero__button home-hero__button--whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Host</span>
            </a>

            <a
              href={`tel:${businessConfig.phone}`}
              className="home-hero__button home-hero__button--outline"
            >
              <Phone className="w-4 h-4" />
              <span>{businessConfig.displayPhone}</span>
            </a>
          </div>

          <a className="home-hero__scroll-cue" href="#experiences">
            <span>Explore Ardya</span>
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* SECTION 2: EXPERIENCE RIBBON */}
      <section id="experiences" className="py-4 bg-white border-b border-[#E5E4DC]">
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

      {/* MOBILE QUICK-JUMP BAR: Fast 1-tap navigation to eliminate endless scrolling */}
      <nav aria-label="Quick Page Navigation" className="flex sm:hidden overflow-x-auto py-2.5 px-4 gap-2 bg-[#FAF8F2] border-b border-[#E5E4DC] sticky top-16 z-30 no-scrollbar">
        <a
          href="#rooms"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          Rooms
        </a>
        <a
          href="#instant-enquiry"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          Book Now
        </a>
        <a
          href="#packages"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          Meal Packages
        </a>
        <a
          href="#routes"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          Drive Times
        </a>
        <a
          href="#faqs"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          FAQs
        </a>
        <a
          href="#location"
          className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-[11px] font-bold text-[#234B36] shadow-xs active:bg-[#234B36] active:text-white transition-colors"
        >
          Map &amp; Route
        </a>
      </nav>

      {/* SECTION 3: NEW DEDICATED REGULAR VS PREMIUM COMPARISON SECTION */}
      <section id="rooms" className="py-8 sm:py-14 bg-white border-b border-[#E5E4DC]">
        <RegularVsPremiumComparison onSelectCategory={(cat) => setSelectedCategory(cat)} />
      </section>

      {/* SECTION 4: 4 GUEST ROOMS PREVIEW */}
      <section className="py-8 sm:py-12 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                Coffee Estate Accommodation
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
                    <div className="p-4 pb-0 sm:p-5 sm:pb-0">
                      <RoomPhotoGallery
                        key={room.id}
                        roomName={room.name}
                        coverImage={room.coverImage}
                        roomImages={room.galleryImages}
                        washroomImages={room.washroomImages}
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-[#26332A]">
                        {room.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-[#536B45]">
                        <span>{room.category} • {room.variety}</span>
                        <span className="text-[#234B36]">
                          from ₹{room.startingPrice.toLocaleString("en-IN")}/person
                        </span>
                      </div>
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

      {/* SECTION 5: ONLINE BOOKING ENQUIRY FORM */}
      <section id="instant-enquiry" className="py-10 sm:py-14 bg-[#FAF8F2] border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#C39A58] block mb-1">
              Direct Reservation Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#234B36]">
              Online Booking Enquiry Form
            </h2>
            <p className="text-xs sm:text-sm text-[#74796F] mt-2 leading-relaxed">
              Calculate live prices, check inclusions, and submit your reservation enquiry directly to the host.
            </p>
          </div>
          <BookingForm initialCategory={selectedCategory} />
        </div>
      </section>

      {/* SECTION 6: DAY IN THE LIFE AT ARDYA */}
      <section className="py-10 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <DayInTheLifeTimeline />
        </div>
      </section>

      {/* SECTION 7: PACKAGE COMPARISON TABLE */}
      <section id="packages" className="py-8 sm:py-12 bg-[#FAF8F2] border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <PackageComparisonTable />
        </div>
      </section>

      {/* SECTION 8: ROAD TRIP NAVIGATOR */}
      <section id="routes" className="py-8 sm:py-12 bg-white border-t border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <DriveTimeCalculator />
        </div>
      </section>

      {/* SECTION 9: INTERACTIVE FAQS SECTION */}
      <HomeFAQSection />

      {/* SECTION 10: GOOGLE MAP & LOCATION */}
      <section id="location" className="py-8 sm:py-12 bg-white border-t border-[#E5E4DC]">
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
