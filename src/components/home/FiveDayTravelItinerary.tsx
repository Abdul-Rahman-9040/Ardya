import React, { useState, useEffect } from "react";
import { ardya5DayItinerary } from "../../data/itinerary";
import { businessConfig } from "../../data/businessConfig";
import { SafeImage } from "../common/SafeImage";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Mountain,
  Waves,
  Trees,
  Landmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
} from "lucide-react";
import { Link } from "react-router-dom";

export const FiveDayTravelItinerary: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false); // Default to false to avoid unexpected layout shifts while user is reading
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  const dayIcons = [Mountain, Waves, Trees, Landmark, Compass];
  const selectedItinerary =
    ardya5DayItinerary.find((d) => d.day === activeDay) || ardya5DayItinerary[0];

  // Auto-switch to next day only when user activates timer
  useEffect(() => {
    if (!isAutoScrolling) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setActiveDay((currentDay) => (currentDay >= 5 ? 1 : currentDay + 1));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoScrolling]);

  // STABLE DAY SWITCHER: Prevents unexpected window scrolling, preserves user scroll position
  const handleSelectDay = (day: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      // Stop event from propagating and triggering window jump
      e.stopPropagation();
    }
    setActiveDay(day);
    setSecondsRemaining(30);
  };

  const shareItineraryOnWhatsApp = () => {
    const text = encodeURIComponent(
      `*Ardya Homestays - 5-Day Sightseeing Itinerary*\n` +
      `Base Camp: Balehalli, Karnataka\n\n` +
      ardya5DayItinerary
        .map(
          (d) =>
            `*DAY ${d.day}: ${d.title}*\n` +
            d.spots.map((s, idx) => `  ${idx + 1}. ${s.name} (${s.tagline})`).join("\n")
        )
        .join("\n\n") +
      `\n\nBook direct stay at Ardya Homestays: +91 ${businessConfig.phone}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E4DC] pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#234B36]/10 text-[#234B36] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C39A58]" />
            <span>Complete Western Ghats Sightseeing Circuit</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
            5-Day Sightseeing Itinerary from Ardya
          </h2>
          <p className="text-xs sm:text-sm text-[#74796F] mt-1 max-w-xl leading-relaxed">
            Ardya Homestays in Balehalli serves as the tranquil central base camp to explore mountain peaks, waterfalls, UNESCO shrines, and safari corridors.
          </p>
        </div>

        {/* Action Controls: Auto-slide ticker + WhatsApp Share */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] text-xs font-semibold text-[#26332A] hover:bg-[#E5E4DC]/50 transition-colors shadow-xs"
            title={isAutoScrolling ? "Pause auto-slide" : "Start auto-slide every 30s"}
          >
            {isAutoScrolling ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Auto-play ({secondsRemaining}s)</span>
                <Pause className="w-3 h-3 text-[#74796F]" />
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#234B36]" />
                <span>Auto-Slide (30s)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={shareItineraryOnWhatsApp}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#234B36] text-white hover:bg-[#536B45] text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* 5-Day Horizontal Tab Ribbon - Horizontal Scroll Container on Mobile with safe touch targets */}
      <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
        <div className="flex sm:grid sm:grid-cols-5 gap-2 min-w-[580px] sm:min-w-0">
          {ardya5DayItinerary.map((item) => {
            const isSelected = activeDay === item.day;
            const Icon = dayIcons[item.day - 1] || Mountain;
            return (
              <button
                key={item.day}
                type="button"
                onClick={(e) => handleSelectDay(item.day, e)}
                className={`flex-1 min-w-[120px] sm:min-w-0 p-3 sm:p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden min-h-[44px] ${
                  isSelected
                    ? "border-[#234B36] bg-[#234B36] text-white shadow-md -translate-y-0.5"
                    : "border-[#E5E4DC] bg-[#FAF8F2] text-[#26332A] hover:border-[#C39A58]"
                }`}
              >
                {isSelected && isAutoScrolling && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-[#C39A58] transition-all duration-1000 ease-linear"
                    style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
                  />
                )}

                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest ${
                      isSelected ? "text-[#C39A58]" : "text-[#74796F]"
                    }`}
                  >
                    DAY {item.day}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${isSelected ? "text-[#C39A58]" : "text-[#234B36]"}`}
                  />
                </div>
                <p className="font-serif font-bold text-xs truncate">{item.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cinematic Day Overview Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E5E4DC] bg-[#234B36] text-white min-h-[160px] flex items-end p-5 sm:p-6 shadow-sm">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={selectedItinerary.coverImage}
            alt={selectedItinerary.title}
            fallbackTitle={selectedItinerary.title}
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#234B36] via-[#234B36]/80 to-transparent z-10" />

        <div className="relative z-20 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C39A58] text-[#234B36] text-[10px] font-extrabold uppercase tracking-wider inline-block">
              DAY {selectedItinerary.day} • {selectedItinerary.badge}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF8F2]">
              {selectedItinerary.title}
            </h3>
            <p className="text-xs text-[#E5E4DC]/90 max-w-xl leading-relaxed">
              {selectedItinerary.description}
            </p>
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow shrink-0 self-start sm:self-auto min-h-[44px]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Base Camp</span>
          </Link>
        </div>
      </div>

      {/* Places to Visit Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#26332A] flex items-center space-x-2">
            <span>Places to Visit on Day {activeDay}:</span>
            <span className="text-[11px] font-normal text-[#74796F]">
              ({selectedItinerary.spots.length} Attractions)
            </span>
          </p>
        </div>

        {/* Balanced 3-column grid inside bounded container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedItinerary.spots.map((spot, i) => (
            <div
              key={i}
              className="group bg-[#FAF8F2] rounded-2xl border border-[#E5E4DC] overflow-hidden hover:shadow-md hover:border-[#234B36] transition-all flex flex-col justify-between"
            >
              <div>
                {spot.image && (
                  <div className="h-40 relative overflow-hidden bg-gray-100">
                    <SafeImage
                      src={spot.image}
                      alt={spot.name}
                      fallbackTitle={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center shadow">
                      {i + 1}
                    </div>
                    {spot.category && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[9px] uppercase font-bold text-white tracking-wider">
                        {spot.category}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-3.5">
                  <h4 className="font-serif font-bold text-sm text-[#26332A] group-hover:text-[#234B36] transition-colors">
                    {spot.name}
                  </h4>
                  <p className="text-xs text-[#74796F] mt-1 line-clamp-2 leading-relaxed">
                    {spot.tagline}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    spot.name + " Chikmagalur Karnataka"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#234B36] hover:text-[#C39A58] transition-colors min-h-[44px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C39A58]" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls with stable click handler */}
      <div className="pt-3 border-t border-[#E5E4DC] flex items-center justify-between text-xs font-semibold text-[#74796F]">
        <button
          type="button"
          disabled={activeDay === 1}
          onClick={(e) => handleSelectDay(Math.max(1, activeDay - 1), e)}
          className="flex items-center space-x-1 hover:text-[#234B36] disabled:opacity-30 disabled:hover:text-[#74796F] min-h-[44px] px-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Day</span>
        </button>

        <div className="flex items-center space-x-1.5">
          {ardya5DayItinerary.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={(e) => handleSelectDay(d.day, e)}
              className={`w-7 h-7 rounded-full text-[11px] font-bold transition-all min-h-[44px] min-w-[28px] flex items-center justify-center ${
                activeDay === d.day
                  ? "bg-[#234B36] text-white shadow-sm"
                  : "bg-white text-[#74796F] hover:bg-[#FAF8F2] border border-[#E5E4DC]"
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={activeDay === 5}
          onClick={(e) => handleSelectDay(Math.min(5, activeDay + 1), e)}
          className="flex items-center space-x-1 hover:text-[#234B36] disabled:opacity-30 disabled:hover:text-[#74796F] min-h-[44px] px-2"
        >
          <span>Next Day</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
