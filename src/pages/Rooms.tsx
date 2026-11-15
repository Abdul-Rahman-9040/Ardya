import React, { useState } from "react";
import { Link } from "react-router-dom";
import { defaultRooms } from "../data/rooms";
import { SEO } from "../components/seo/SEO";
import { RoomPhotoGallery } from "../components/rooms/RoomPhotoGallery";
import { RegularVsPremiumComparison } from "../components/home/RegularVsPremiumComparison";
import { getActivePricingConfig, RoomCategory } from "../data/pricingConfig";
import { BedDouble, Users, ArrowRight, Check, Sparkles, Filter } from "lucide-react";

export const Rooms: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"All" | "Regular" | "Premium">("All");
  const pricing = getActivePricingConfig();

  const filteredRooms =
    activeFilter === "All"
      ? defaultRooms
      : defaultRooms.filter((r) => r.category === activeFilter);

  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        title="Rooms & Suites | Ardya Homestays – Regular & Premium Rooms in Balehalli"
        description="Explore our 4 rooms at Ardya Homestays: Regular Rooms (Arabica 1 & 2 from ₹1,500) and Premium Suites (Robusta Premium 1 & 2 from ₹2,000) surrounded by coffee plantations."
        canonical="/rooms"
      />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-14 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C39A58]/20 text-[#C39A58] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Exclusive Rooms • 2 Categories</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Our Guest Rooms &amp; Suites
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            Choose between our cozy <strong>Regular Rooms (Arabica)</strong> starting at ₹1,500/person and spacious <strong>Premium Suites (Robusta)</strong> starting at ₹2,000/person.
          </p>
        </div>
      </section>

      {/* DEDICATED REGULAR VS PREMIUM COMPARISON SECTION */}
      <section className="py-10 sm:py-14 bg-white border-b border-[#E5E4DC]">
        <RegularVsPremiumComparison />
      </section>

      {/* ROOM LISTING WITH CATEGORY FILTERS */}
      <section className="py-12 sm:py-16 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E4DC] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C39A58]">
                Inventory Explorer
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
                All 4 Available Rooms
              </h2>
            </div>

            {/* Filter Pills - Mobile friendly horizontal container */}
            <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#E5E4DC] shadow-xs overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  activeFilter === "All"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F] hover:text-[#26332A]"
                }`}
              >
                All 4 Rooms
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Regular")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  activeFilter === "Regular"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F] hover:text-[#26332A]"
                }`}
              >
                Regular (Arabica)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Premium")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  activeFilter === "Premium"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F] hover:text-[#26332A]"
                }`}
              >
                Premium (Robusta)
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-3xl border border-[#E5E4DC] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="p-4 pb-0 sm:p-5 sm:pb-0">
                    <RoomPhotoGallery
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
                    <p className="text-xs text-[#74796F] mt-1.5 line-clamp-2 leading-relaxed">
                      {room.shortDescription}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-[#536B45]">
                      <span>{room.category} • {room.variety}</span>
                      <span className="text-[#234B36]">
                        from ₹{room.startingPrice.toLocaleString("en-IN")}/person
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E5E4DC] flex items-center justify-between text-xs text-[#26332A]">
                      <span className="flex items-center space-x-1.5 text-[#536B45]">
                        <BedDouble className="w-4 h-4 text-[#C39A58]" />
                        <span>{room.capacity.bedConfiguration}</span>
                      </span>
                      <span className="font-semibold text-[#234B36]">Attached Washroom</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-2.5">
                  <Link
                    to={`/booking?room=${room.id}&category=${room.category}`}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-3 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors min-h-[44px]"
                  >
                    <span>Enquire for {room.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/rooms/${room.category.toLowerCase()}`}
                    className="px-4 py-3 border border-[#E5E4DC] hover:border-[#234B36] text-[#26332A] text-xs font-bold rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
