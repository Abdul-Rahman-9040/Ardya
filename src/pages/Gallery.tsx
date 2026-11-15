import React, { useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from "lucide-react";
import { defaultGallery, type GalleryItem } from "../data/gallery";
import { propertyPhotos } from "../data/propertyPhotos";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";

const categories: { id: "all" | GalleryItem["category"]; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "exterior", label: "The property" },
  { id: "arabica", label: "Arabica rooms" },
  { id: "robusta-premium", label: "Robusta rooms" },
  { id: "washrooms", label: "Washrooms" },
  { id: "outdoor", label: "Outdoors" },
  { id: "destinations", label: "Places nearby" },
];

const categoryLabels: Record<GalleryItem["category"], string> = {
  exterior: "Property & estate",
  arabica: "Arabica room",
  "robusta-premium": "Robusta room",
  washrooms: "Washroom",
  outdoor: "Outdoor spaces",
  dining: "Dining",
  destinations: "Nearby place",
};

const getPhotoLabel = (item: GalleryItem) =>
  item.roomAssociation || categoryLabels[item.category];

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = defaultGallery
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) =>
          index === null ? null : (index + 1) % filteredItems.length
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index === null
            ? null
            : (index - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const selectedPhoto =
    lightboxIndex === null ? null : filteredItems[lightboxIndex] ?? null;

  return (
    <div className="overflow-x-hidden bg-[#FAF8F2] text-[#26332A] selection:bg-[#C39A58] selection:text-[#234B36]">
      <SEO
        title="Photo Gallery | Ardya Homestays Property & Rooms"
        description="Explore real photos of Ardya Homestays, its coffee-estate rooms and outdoor spaces, plus nearby places to visit in Balehalli and the Western Ghats."
        canonical="/gallery"
      />

      <section
        data-no-scroll-reveal
        className="relative isolate flex min-h-[480px] items-center justify-center overflow-hidden bg-[#234B36] text-center text-[#FAF8F2] sm:min-h-[560px]"
      >
        <div className="absolute inset-0 -z-10">
          <SafeImage
            src={propertyPhotos.featuredExterior}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,43,30,0.83),rgba(22,52,36,0.58)_52%,rgba(18,43,30,0.76)),linear-gradient(0deg,rgba(18,43,30,0.45),transparent_60%)]" />
        </div>
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[#536B45]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 right-0 h-96 w-96 rounded-full bg-[#C39A58]/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <p className="home-hero__eyebrow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[#E4C58C] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C39A58]" />
            A glimpse of Ardya
          </p>
          <h1 className="home-hero__title mx-auto max-w-4xl text-[#FAF8F2]">
            A stay shaped by
            <span className="home-hero__title-accent block italic">
              the outdoors.
            </span>
          </h1>
          <p className="home-hero__description mx-auto max-w-2xl text-white/85">
            Wander through our coffee-estate homestay, relaxed rooms, and
            favourite places around the Western Ghats—all in one little tour.
          </p>
          <div className="home-hero__weather mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/85 sm:text-sm">
            <span className="font-semibold text-white">
              {defaultGallery.length} photos
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#C39A58] sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#E4C58C]" />
              Balehalli, Chikkamagaluru
            </span>
          </div>
          <div className="home-hero__actions">
            <a
              href="#gallery-photos"
              className="home-hero__button home-hero__button--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E4C58C]"
            >
              Explore the photos
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="gallery-photos"
        className="scroll-mt-24 border-b border-[#E5E4DC] bg-[#FAF8F2]"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-5 text-center sm:mb-7">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B754E] sm:text-xs">
                The photo collection
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#234B36] sm:text-3xl">
                Find your favourite view
              </h2>
            </div>
            <p className="mt-2 text-sm text-[#74796F]">
              {filteredItems.length} {filteredItems.length === 1 ? "photo" : "photos"}
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter photos by category"
            className="-mx-4 flex justify-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {categories.map((category) => {
              const count =
                category.id === "all"
                  ? defaultGallery.length
                  : defaultGallery.filter((item) => item.category === category.id)
                      .length;
              if (!count) return null;

              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setLightboxIndex(null);
                  }}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C39A58] sm:text-sm ${
                    active
                      ? "border-[#234B36] bg-[#234B36] text-white shadow-sm"
                      : "border-[#E5E4DC] bg-white/70 text-[#4D574D] hover:border-[#536B45] hover:text-[#234B36]"
                  }`}
                >
                  {category.label}
                  <span className={`ml-2 text-[10px] ${active ? "text-white/70" : "text-[#8D9289]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-4 mt-4 text-xs text-[#74796F] sm:hidden">
            Showing {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "photo" : "photos"}
          </div>

          {filteredItems.length ? (
            <div className="grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => {
                const portrait = index % 7 === 0;
                const wide = index % 5 === 2;
                const ratio = portrait
                  ? "aspect-[4/5]"
                  : wide
                    ? "aspect-[5/3]"
                    : "aspect-[4/3]";

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-scroll-reveal="card"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`View photo: ${item.title}`}
                    style={{ transitionDelay: `${(index % 8) * 55}ms` }}
                    className={`group relative block w-full overflow-hidden rounded-2xl bg-[#E5E4DC] text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C39A58] sm:rounded-[1.35rem] ${ratio}`}
                  >
                    <SafeImage
                      src={item.imagePath}
                      alt={item.altText}
                      fallbackTitle={item.title}
                      categoryName={categoryLabels[item.category]}
                      loading={index < 8 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#E4C58C] sm:text-[10px]">
                        {categoryLabels[item.category]}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm font-semibold sm:text-base">
                        {getPhotoLabel(item)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#D7D8CF] bg-white/60 px-6 py-16 text-center">
              <p className="font-serif text-xl text-[#234B36]">More photos coming soon</p>
              <p className="mt-2 text-sm text-[#74796F]">
                Try another collection to keep exploring Ardya.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111713]/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4C58C] sm:right-7 sm:top-7"
            aria-label="Close photo viewer"
          >
            <X className="h-5 w-5" />
          </button>
          {filteredItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((index) =>
                    index === null
                      ? null
                      : (index - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4C58C] sm:left-6 sm:p-3"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((index) =>
                    index === null ? null : (index + 1) % filteredItems.length
                  )
                }
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4C58C] sm:right-6 sm:p-3"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}
          <div className="flex max-h-full w-full max-w-5xl flex-col items-center">
            <div className="relative h-[min(70vh,720px)] w-full">
              <SafeImage
                src={selectedPhoto.imagePath}
                alt={selectedPhoto.altText}
                fallbackTitle={selectedPhoto.title}
                categoryName={categoryLabels[selectedPhoto.category]}
                loading="eager"
                className="h-full w-full rounded-xl object-contain sm:rounded-2xl"
              />
            </div>
            <div className="mt-4 max-w-2xl text-center text-white">
              <p className="font-serif text-lg sm:text-xl">{getPhotoLabel(selectedPhoto)}</p>
              <p className="mt-1 text-xs leading-5 text-white/65 sm:text-sm">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
