import React, { useState } from "react";
import { Link } from "react-router-dom";
import { defaultRooms } from "../data/rooms";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";
import { BedDouble, Users, Waves, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getActivePricingConfig, RoomCategory } from "../data/pricingConfig";

interface CategoryPageProps {
  category: RoomCategory;
}

export const CategoryRoomPage: React.FC<CategoryPageProps> = ({ category }) => {
  const isRegular = category === "Regular";
  const pricing = getActivePricingConfig();
  const rooms = defaultRooms.filter((r) => r.category === category);
  const categoryConfig = pricing[category];

  const title = isRegular
    ? "Regular Rooms (Arabica) | Ardya Homestays – Balehalli"
    : "Premium Rooms (Robusta) | Ardya Homestays – Balehalli";

  const description = isRegular
    ? "Discover Arabica 1 and Arabica 2: comfortable Regular Rooms enveloped by coffee flora at Ardya Homestays, starting at ₹1,500/person."
    : "Experience Robusta Premium 1 and Robusta Premium 2: spacious Premium Suites with elevated veranda perspectives, starting at ₹2,000/person.";

  return (
    <div className="w-full overflow-x-hidden">
      <SEO title={title} description={description} canonical={`/rooms/${isRegular ? "regular" : "premium"}`} />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C39A58]/20 text-[#C39A58] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coffee Variety: {categoryConfig.variety}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            {category} Rooms ({categoryConfig.variety} Variety)
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            {isRegular
              ? "Two intimate, cozy rooms nestled in coffee bushes with attached washrooms, starting at ₹1,500/person."
              : "Two spacious luxury suites with handcrafted wood decor and panoramic veranda views, starting at ₹2,000/person."}
          </p>

          <div className="pt-2 flex justify-center">
            <span className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              Starting Rate: ₹{categoryConfig.startingPrice.toLocaleString("en-IN")} / person (Stay Only) • ₹{categoryConfig.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")} (With Meals)
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb / Nav */}
      <div className="bg-[#FAF8F2] border-b border-[#E5E4DC] py-3 text-xs text-[#74796F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center space-x-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:underline">Rooms</Link>
          <span>/</span>
          <span className="text-[#26332A] font-semibold">{category} ({categoryConfig.variety})</span>
        </div>
      </div>

      {/* Room Cards */}
      <section className="py-12 sm:py-16 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Images */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-[#E5E4DC] h-64 sm:h-80 bg-gray-100">
                    <SafeImage
                      src={room.coverImage}
                      alt={room.name}
                      fallbackTitle={room.name}
                      categoryName={room.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 8-Photo Detailed Gallery Grid */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#74796F]">
                      Room Photo Gallery ({room.galleryImages.length} HD Photos):
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {room.galleryImages.map((img, idx) => (
                        <div key={idx} className="h-16 sm:h-20 rounded-xl overflow-hidden border border-[#E5E4DC] hover:border-[#234B36] transition-all group relative cursor-pointer">
                          <SafeImage
                            src={img}
                            alt={`${room.name} detailed shot ${idx + 1}`}
                            fallbackTitle={`${room.name} ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Information */}
                <div className="flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                        Ardya Homestays • {room.category} ({room.variety})
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#234B36]/10 text-[#234B36] font-serif font-bold text-xs">
                        from ₹{room.startingPrice.toLocaleString("en-IN")}/person
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#26332A] mt-1 mb-2">
                      {room.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#74796F] leading-relaxed mb-4">
                      {room.longDescription}
                    </p>

                    <div className="space-y-2.5 py-4 border-y border-[#E5E4DC] text-xs">
                      <div className="flex items-center space-x-2 text-[#26332A]">
                        <BedDouble className="w-4 h-4 text-[#C39A58] shrink-0" />
                        <span><strong>Bedding:</strong> {room.capacity.bedConfiguration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#26332A]">
                        <Users className="w-4 h-4 text-[#C39A58] shrink-0" />
                        <span><strong>Capacity:</strong> Accommodates up to {room.capacity.maxGuests} guests comfortably</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#26332A]">
                        <Waves className="w-4 h-4 text-[#C39A58] shrink-0" />
                        <span><strong>Bathroom:</strong> {room.bathroomDetails}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#26332A] mb-2.5">
                        Room Inclusions &amp; Amenities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#74796F]">
                        {room.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Check className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E4DC] flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/booking?room=${room.id}&category=${room.category}`}
                      className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow min-h-[44px]"
                    >
                      <span>Enquire for {room.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/gallery"
                      className="py-3.5 px-6 border border-[#234B36] text-[#234B36] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider rounded-xl text-center min-h-[44px] flex items-center justify-center"
                    >
                      View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
