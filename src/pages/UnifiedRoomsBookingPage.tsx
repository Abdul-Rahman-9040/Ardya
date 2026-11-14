import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { defaultRooms, Room } from "../data/rooms";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";
import { BookingForm } from "../components/booking/BookingForm";
import { getActivePricingConfig, RoomCategory } from "../data/pricingConfig";
import {
  BedDouble,
  Users,
  Waves,
  Check,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { businessConfig } from "../data/businessConfig";

export const UnifiedRoomsBookingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pricing = getActivePricingConfig();

  // Selected room state (sync with query param ?room=)
  const roomParam = searchParams.get("room") || "arabica-1";
  const [selectedRoomId, setSelectedRoomId] = useState<string>(roomParam);

  // Active Category filter
  const [categoryFilter, setCategoryFilter] = useState<"All" | RoomCategory>("All");

  // Selected active room object
  const activeRoom = defaultRooms.find((r) => r.id === selectedRoomId) || defaultRooms[0];

  // Active preview image in main showcase
  const [activePhoto, setActivePhoto] = useState<string>(activeRoom.coverImage);

  // Lightbox modal state
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Keep active photo updated when room changes
  useEffect(() => {
    setActivePhoto(activeRoom.coverImage);
  }, [activeRoom]);

  // Handle room selection and update URL cleanly without reload
  const handleSelectRoom = (room: Room) => {
    setSelectedRoomId(room.id);
    setActivePhoto(room.coverImage);
    setSearchParams({ room: room.id, category: room.category }, { replace: true });

    // Smooth scroll down to the interactive enquiry form on mobile
    if (window.innerWidth < 1024) {
      const el = document.getElementById("booking-action-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const filteredRooms =
    categoryFilter === "All"
      ? defaultRooms
      : defaultRooms.filter((r) => r.category === categoryFilter);

  const regularRooms = defaultRooms.filter((r) => r.category === "Regular");
  const premiumRooms = defaultRooms.filter((r) => r.category === "Premium");

  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        title="Rooms, Photos & Instant Booking | Ardya Homestays – Balehalli"
        description="Explore verified HD camera and drone photos for all 4 rooms at Ardya Homestays. Check live rates (Regular from ₹1,500, Premium from ₹2,000) and book instantly on WhatsApp."
        canonical="/rooms"
      />

      {/* Header Banner - Compact & Modern */}
      <section className="bg-[#234B36] text-white py-10 sm:py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C39A58]/20 text-[#C39A58] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Exclusive Rooms • Real HD Photography • Instant Booking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Our Rooms &amp; Instant Booking
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            Select any room below to view its multi-angle HD camera &amp; drone photos, check transparent pricing, and enquire directly with the host on WhatsApp.
          </p>
        </div>
      </section>

      {/* UNIFIED 1-PAGE ROOMS & BOOKING WORKSPACE */}
      <section className="py-8 sm:py-12 bg-[#FAF8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* STEP 1: COMPACT ROOM SELECTOR STRIP (All 4 Rooms with Thumbnails) */}
          <div className="bg-white rounded-3xl border border-[#E5E4DC] p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E4DC] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#C39A58] block">
                  Step 1: Pick a Room to View Photos &amp; Enquire
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#234B36]">
                  Select Room (4 Available)
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1.5 bg-[#FAF8F2] p-1 rounded-xl border border-[#E5E4DC] self-start sm:self-auto overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    categoryFilter === "All"
                      ? "bg-[#234B36] text-white shadow-xs"
                      : "text-[#74796F] hover:text-[#26332A]"
                  }`}
                >
                  All 4 Rooms
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("Regular")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    categoryFilter === "Regular"
                      ? "bg-[#234B36] text-white shadow-xs"
                      : "text-[#74796F] hover:text-[#26332A]"
                  }`}
                >
                  Regular (Arabica)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("Premium")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                    categoryFilter === "Premium"
                      ? "bg-[#234B36] text-white shadow-xs"
                      : "text-[#74796F] hover:text-[#26332A]"
                  }`}
                >
                  Premium (Robusta)
                </button>
              </div>
            </div>

            {/* 4 Clickable Room Cards in a Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredRooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleSelectRoom(room)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between overflow-hidden group min-h-[140px] ${
                      isSelected
                        ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-md"
                        : "border-[#E5E4DC] bg-white hover:border-[#C39A58] hover:shadow-xs"
                    }`}
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-gray-100 relative mb-2">
                        <img
                          src={room.coverImage}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#234B36]/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider">
                          {room.category}
                        </span>
                        {isSelected && (
                          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-[#C39A58] text-[#234B36] text-[9px] font-extrabold uppercase shadow">
                            Active
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#26332A] truncate">
                        {room.name}
                      </h4>
                      <p className="text-[10px] text-[#74796F] truncate">{room.variety} Variety • {room.capacity.bedConfiguration}</p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#E5E4DC]/80 flex items-center justify-between">
                      <span className="font-serif font-extrabold text-xs sm:text-sm text-[#234B36]">
                        from ₹{room.startingPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-[#C39A58] font-bold group-hover:underline">
                        {isSelected ? "Selected ✓" : "View & Book →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SPLIT WORKSPACE: ROOM HD PHOTOS & DETAILS ON LEFT, BOOKING CALCULATOR ON RIGHT */}
          <div id="booking-action-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE ROOM HD PHOTO SHOWCASE & SPECS */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-7 shadow-xs space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58]">
                    {activeRoom.category} Room • {activeRoom.variety} Variety
                  </span>
                  <span className="text-xs font-bold font-serif text-[#234B36] bg-[#234B36]/10 px-2.5 py-1 rounded-full">
                    from ₹{activeRoom.startingPrice.toLocaleString("en-IN")}/person
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#26332A]">
                  {activeRoom.name} Photography &amp; Details
                </h3>
                <p className="text-xs text-[#74796F] mt-1 leading-relaxed">
                  {activeRoom.longDescription}
                </p>
              </div>

              {/* Main Active Photo with Zoom Lightbox Trigger */}
              <div
                className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#E5E4DC] bg-gray-100 relative group cursor-pointer shadow-inner"
                onClick={() => setLightboxImg(activePhoto)}
              >
                <SafeImage
                  src={activePhoto}
                  alt={activeRoom.name}
                  fallbackTitle={activeRoom.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tap to Enlarge</span>
                </button>
              </div>

              {/* Thumbnails of All 8 Detailed HD Photos for this Room */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#74796F]">
                    Click any thumbnail to preview ({activeRoom.galleryImages.length} HD Photos):
                  </p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {activeRoom.galleryImages.map((img, idx) => {
                    const isActive = activePhoto === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhoto(img)}
                        className={`h-16 sm:h-20 rounded-xl overflow-hidden border transition-all ${
                          isActive
                            ? "border-[#234B36] ring-2 ring-[#234B36] shadow-sm"
                            : "border-[#E5E4DC] hover:border-[#C39A58] opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`${activeRoom.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Room Specs & Inclusions */}
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] space-y-3">
                <h5 className="font-serif font-bold text-sm text-[#26332A]">
                  Verified Room Amenities:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#26332A]">
                  <div className="flex items-center space-x-2">
                    <BedDouble className="w-3.5 h-3.5 text-[#C39A58] shrink-0" />
                    <span>{activeRoom.capacity.bedConfiguration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-[#C39A58] shrink-0" />
                    <span>Up to {activeRoom.capacity.maxGuests} Guests comfortably</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Waves className="w-3.5 h-3.5 text-[#C39A58] shrink-0" />
                    <span>Private attached bathroom (24/7 Hot Water)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Daily housekeeping &amp; power backup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING ENGINE PRE-LOADED FOR THIS EXACT ROOM */}
            <div className="lg:col-span-6 space-y-4">
              <BookingForm
                initialCategory={activeRoom.category}
                initialRoomId={activeRoom.id}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Full size view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
