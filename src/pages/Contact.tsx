import React from "react";
import { businessConfig } from "../data/businessConfig";
import { SEO } from "../components/seo/SEO";
import { Phone, MessageCircle, MapPin, ExternalLink, Clock, ShieldCheck, Mail } from "lucide-react";
import { BookingForm } from "../components/booking/BookingForm";

export const Contact: React.FC = () => {
  return (
    <div className="overflow-x-hidden selection:bg-[#C39A58] selection:text-[#234B36]">
      <SEO
        title="Contact & Booking Enquiry | Ardya Homestays – 8277446061"
        description="Contact Ardya Homestays in Balehalli directly via phone or WhatsApp at 8277446061. Enquire about room availability, packages and directions."
        canonical="/contact"
      />

      {/* Header Banner */}
      <section className="relative bg-[#234B36] text-white py-14 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#536B45_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C39A58] font-bold">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Contact Ardya Homestays
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 max-w-md mx-auto">
            Direct host touchpoints for route guidance, dates, and instant WhatsApp bookings.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Information Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E5E4DC] p-6 shadow-sm space-y-5">
                <h3 className="font-serif text-xl font-bold text-[#234B36]">
                  Direct Touchpoints
                </h3>

                <div className="space-y-4 text-xs">
                  {/* Phone */}
                  <a
                    href={`tel:${businessConfig.phone}`}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#E5E4DC]/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#234B36]/10 text-[#234B36] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="font-bold text-[#26332A]">Direct Phone Line</p>
                      <p className="text-sm font-bold text-[#234B36]">{businessConfig.displayPhone}</p>
                      <p className="text-[11px] text-[#74796F] mt-0.5">Quick inquiries & en-route directions</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${businessConfig.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#E5E4DC]/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="font-bold text-[#26332A]">WhatsApp Chat</p>
                      <p className="text-sm font-bold text-[#25D366]">+91 {businessConfig.phone}</p>
                      <p className="text-[11px] text-[#74796F] mt-0.5">Instant availability checks & GPS location</p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start space-x-3 p-3 rounded-2xl bg-[#FAF8F2]">
                    <div className="w-10 h-10 rounded-xl bg-[#C39A58]/10 text-[#C39A58] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#26332A]">Homestay Location</p>
                      <p className="text-[11px] text-[#74796F] mt-0.5 leading-relaxed">{businessConfig.fullAddressNote}</p>
                      <a
                        href={businessConfig.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-[#234B36] font-bold underline mt-1"
                      >
                        <span>Open Map Pin</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F2] text-xs">
                    <span className="text-[#74796F]">Check-in: <strong>{businessConfig.checkInTime}</strong></span>
                    <span className="text-[#E5E4DC]">|</span>
                    <span className="text-[#74796F]">Check-out: <strong>{businessConfig.checkOutTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* Booking Confidence */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E4DC] text-xs text-[#74796F] flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#234B36] shrink-0" />
                <span>Zero commission • Direct host pricing guaranteed</span>
              </div>
            </div>

            {/* Right side: Streamlined Booking Form (7 cols) */}
            <div className="lg:col-span-7">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
