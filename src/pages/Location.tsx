import React from "react";
import { businessConfig } from "../data/businessConfig";
import { SEO } from "../components/seo/SEO";
import { GoogleMapEmbed } from "../components/common/GoogleMapEmbed";
import { MapPin, Navigation, Phone, MessageCircle, ExternalLink, Compass, ShieldCheck, Car } from "lucide-react";

export const LocationPage: React.FC = () => {
  return (
    <div>
      <SEO
        title="Location & Directions | Ardya Homestays – Balehalli, Karnataka"
        description="Verified turn-by-turn interactive Google Maps directions to Ardya Homestays in Balehalli, Karnataka. Accessible via scenic Western Ghats highways."
        canonical="/location"
      />

      {/* Modern Header Banner */}
      <section className="relative bg-[#234B36] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#536B45_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#C39A58] uppercase font-bold tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Map & Road Guide</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-[#FAF8F2]">
            Location & Directions
          </h1>
          <p className="text-sm sm:text-base text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            Nestled in tranquil Balehalli, Karnataka. Use our embedded interactive Google Maps below for live GPS routing straight to our gate.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 bg-[#FAF8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Interactive Google Map Embed (Full Width Modern) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                  Live Satellite & Street View
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#234B36] mt-1">
                  Interactive Google Map
                </h2>
              </div>
              <p className="text-xs text-[#74796F] mt-2 sm:mt-0">
                Zoom, pan, or open directly in the Google Maps app
              </p>
            </div>
            
            <GoogleMapEmbed
              title="Ardya Homestays Official Pin"
              subtitle="Balehalli, Karnataka"
              heightClass="h-[480px]"
            />
          </div>

          {/* Details & Assistance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Card: Address & Navigation */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DC]">
                <h3 className="font-serif text-xl font-bold text-[#26332A]">
                  Verified Property Details
                </h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                  Google Verified
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#C39A58] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#26332A] text-sm">Full Landmark Address</p>
                    <p className="text-[#74796F] mt-0.5 leading-relaxed">{businessConfig.fullAddressNote}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Car className="w-5 h-5 text-[#C39A58] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#26332A] text-sm">Road Condition & Accessibility</p>
                    <p className="text-[#74796F] mt-0.5 leading-relaxed">
                      All-weather paved asphalt road leading to the gate. Fully accessible by hatchbacks, sedans, SUVs, and bikes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#C39A58] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#26332A] text-sm">On-Site Parking</p>
                    <p className="text-[#74796F] mt-0.5">Complimentary secure parking inside property perimeter.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E4DC] flex flex-col sm:flex-row gap-3">
                <a
                  href={businessConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Launch Google Maps GPS</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                <a
                  href={`https://wa.me/${businessConfig.phone}?text=Hello%20Ardya%20Homestays,%20please%20send%20the%20Google%20Maps%20live%20location.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Location</span>
                </a>
              </div>
            </div>

            {/* Right Card: En-Route Support & Guidance */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E4DC]">
                  <h3 className="font-serif text-xl font-bold text-[#26332A]">
                    En-Route Host Support
                  </h3>
                  <span className="text-xs text-[#536B45] font-semibold">
                    Direct Assistance
                  </span>
                </div>

                <p className="text-xs text-[#74796F] mt-4 leading-relaxed">
                  Heading towards Balehalli? If you need landmark verification or live turning assistance at any point during your journey, call the host directly:
                </p>

                <div className="mt-5 p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#74796F] uppercase tracking-wider font-semibold">Direct Call</span>
                    <p className="font-bold font-serif text-lg text-[#234B36]">{businessConfig.displayPhone}</p>
                  </div>
                  <a
                    href={`tel:${businessConfig.phone}`}
                    className="p-3 bg-[#234B36] text-white rounded-full hover:bg-[#536B45] transition-colors shadow"
                    title="Call Host"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>

                <div className="mt-5 space-y-2 text-xs text-[#74796F]">
                  <p className="font-semibold text-[#26332A]">Helpful Driving Tips:</p>
                  <ul className="list-disc list-inside space-y-1 leading-relaxed">
                    <li>Recommended check-in window starts at {businessConfig.checkInTime}.</li>
                    <li>Download offline Google Maps for the Balehalli region to avoid spotty connectivity in dense estate sections.</li>
                    <li>Look out for the local Sanjivini Vana / Mullunde turnings.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E4DC] text-center text-xs text-[#74796F]">
                Host is available to guide you at the gate upon arrival.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
