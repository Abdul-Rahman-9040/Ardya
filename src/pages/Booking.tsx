import React from "react";
import { useSearchParams } from "react-router-dom";
import { BookingForm } from "../components/booking/BookingForm";
import { SEO } from "../components/seo/SEO";
import { businessConfig } from "../data/businessConfig";
import { Phone, MessageCircle, ShieldCheck, Sparkles, MapPin, Coffee } from "lucide-react";
import { RoomCategory } from "../data/pricingConfig";

export const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get("room") || undefined;
  const categoryParam = (searchParams.get("category") as RoomCategory) || (roomParam?.startsWith("robusta") ? "Premium" : "Regular");

  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        title="Direct Booking Enquiry | Ardya Homestays – Balehalli"
        description="Book your stay at Ardya Homestays. Transparent rates: Regular Rooms (Arabica from ₹1,500/person) and Premium Suites (Robusta from ₹2,000/person). WhatsApp direct host confirmation."
        canonical="/booking"
      />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-14 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C39A58] font-bold">
            Transparent Pricing • Direct Host Confirmation
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Book Your Stay at Ardya
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            Fill in your dates and room choice below. The calculator computes the exact price and launches pre-filled WhatsApp directly with the host.
          </p>
        </div>
      </section>

      {/* Booking Form Container */}
      <section className="py-12 sm:py-16 bg-[#FAF8F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <BookingForm initialCategory={categoryParam} initialRoomId={roomParam} />

          {/* Value Props & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] text-center space-y-1 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#234B36] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#26332A]">Direct Host Booking</h4>
              <p className="text-[11px] text-[#74796F]">Zero third-party commission, verified local host connection.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] text-center space-y-1 shadow-xs">
              <Coffee className="w-5 h-5 text-[#C39A58] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#26332A]">Complimentary Meals Option</h4>
              <p className="text-[11px] text-[#74796F]">Traditional Malnad breakfast &amp; dinner freshly prepared.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] text-center space-y-1 shadow-xs">
              <MapPin className="w-5 h-5 text-[#234B36] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#26332A]">Balehalli Base Camp</h4>
              <p className="text-[11px] text-[#74796F]">Paved road access with 5-day sightseeing circuit.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
