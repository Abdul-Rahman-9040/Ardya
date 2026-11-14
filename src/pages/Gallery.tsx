import React, { useState } from "react";
import { defaultGallery } from "../data/gallery";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";
import { X, ZoomIn, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "exterior", label: "Exterior" },
    { id: "arabica", label: "Arabica Rooms" },
    { id: "robusta-premium", label: "Robusta Premium" },
    { id: "washrooms", label: "Washrooms" },
    { id: "outdoor", label: "Outdoor & Campfire" },
  ];

  const filteredItems = defaultGallery
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="overflow-x-hidden selection:bg-[#C39A58] selection:text-[#234B36]">
      <SEO
        title="Photo Gallery | Ardya Homestays Property & Rooms"
        description="Browse photographs of Ardya Homestays exterior, Arabica rooms, Robusta Premium rooms, washrooms, and surrounding estate gardens in Balehalli."
        canonical="/gallery"
      />

      {/* Header Banner */}
      <section className="relative bg-[#234B36] text-white py-14 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#536B45_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C39A58] font-bold">
            Visual Experience
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Property Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 max-w-md mx-auto">
            Take a visual tour through our coffee flora, rooms, verandas, and outdoor sit-outs.
          </p>
        </div>
      </section>

      {/* Modern Filter Pill Bar */}
      <section className="bg-white/80 backdrop-blur-md border-b border-[#E5E4DC] py-3 sticky top-16 sm:top-20 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar space-x-2 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#234B36] text-white shadow-sm"
                  : "bg-[#FAF8F2] text-[#26332A] hover:bg-[#E5E4DC]/50 border border-[#E5E4DC]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Masonry-Style Grid */}
      <section className="py-12 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#E5E4DC] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 sm:h-56 overflow-hidden relative">
                  <SafeImage
                    src={item.imagePath}
                    alt={item.altText}
                    fallbackTitle={item.title}
                    categoryName={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[9px] uppercase font-bold text-white tracking-wider">
                    {item.category.replace("-", " ")}
                  </span>
                </div>

                <div className="p-3">
                  <h4 className="font-semibold text-xs text-[#26332A] truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#74796F] truncate mt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessible Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <SafeImage
              src={filteredItems[lightboxIndex].imagePath}
              alt={filteredItems[lightboxIndex].altText}
              fallbackTitle={filteredItems[lightboxIndex].title}
              categoryName={filteredItems[lightboxIndex].category}
              className="max-h-[70vh] rounded-2xl shadow-2xl object-contain"
            />
            <div className="text-center text-white mt-4 space-y-1">
              <h3 className="font-serif text-lg font-bold">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-xs text-white/70">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
