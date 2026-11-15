import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { SafeImage } from "../common/SafeImage";

interface RoomPhotoGalleryProps {
  roomName: string;
  coverImage: string;
  roomImages: string[];
  washroomImages: string[];
}

export const RoomPhotoGallery: React.FC<RoomPhotoGalleryProps> = ({
  roomName,
  coverImage,
  roomImages,
  washroomImages,
}) => {
  const photos = Array.from(new Set([coverImage, ...roomImages, ...washroomImages]));
  const washroomSet = new Set(washroomImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activePhoto = photos[activeIndex] ?? coverImage;
  const activePhotoType = washroomSet.has(activePhoto) ? "Attached washroom" : "Room";

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [roomName, coverImage]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, photos.length]);

  const showPrevious = () =>
    setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % photos.length);

  return (
    <div className="space-y-3">
      <div className="group relative h-64 w-full overflow-hidden rounded-2xl border border-[#E5E4DC] bg-[#E5E4DC] sm:h-80">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
          aria-label={`Enlarge ${roomName} ${activePhotoType.toLowerCase()} photo`}
        >
          <SafeImage
            key={activePhoto}
            src={activePhoto}
            alt={`${roomName} ${activePhotoType.toLowerCase()} photo`}
            fallbackTitle={`${roomName} ${activePhotoType}`}
            categoryName={activePhotoType}
            loading="eager"
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>

        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[#234B36]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          {activePhotoType}
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          {activeIndex + 1} / {photos.length}
        </span>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label={`Previous ${roomName} photo`}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-black/45 p-2 text-white shadow transition hover:bg-[#234B36]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={`Next ${roomName} photo`}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-black/45 p-2 text-white shadow transition hover:bg-[#234B36]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${roomName} photo viewer`}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-3 py-2 text-[10px] font-semibold text-white backdrop-blur-sm transition hover:bg-[#234B36]"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Enlarge
        </button>
      </div>

      <div
        role="group"
        aria-label={`${roomName} photo thumbnails`}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {photos.map((photo, index) => {
          const isWashroom = washroomSet.has(photo);
          const photoType = isWashroom ? "washroom" : "room";
          return (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${roomName} ${photoType} photo ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-[4.5rem] sm:w-24 ${
                activeIndex === index
                  ? "border-[#234B36] ring-2 ring-[#234B36]/20"
                  : "border-[#E5E4DC] opacity-80 hover:border-[#C39A58] hover:opacity-100"
              }`}
            >
              <SafeImage
                src={photo}
                alt=""
                aria-hidden="true"
                className="h-full w-full"
              />
              {isWashroom && (
                <span className="absolute inset-x-0 bottom-0 bg-black/65 py-0.5 text-center text-[8px] font-bold uppercase tracking-wide text-white">
                  Washroom
                </span>
              )}
            </button>
          );
        })}
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${roomName} photo viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25 sm:right-7 sm:top-7"
          >
            <X className="h-5 w-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25 sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25 sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="flex max-h-full w-full max-w-6xl flex-col items-center">
            <img
              src={activePhoto}
              alt={`${roomName} ${activePhotoType.toLowerCase()} photo`}
              className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl sm:rounded-2xl"
            />
            <p className="mt-4 text-center text-sm font-semibold text-white">
              {roomName} · {activePhotoType} · {activeIndex + 1} of {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
