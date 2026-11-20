import React, { useState } from "react";
import { CloudRain, Sun, Compass, Navigation, Car, Clock, Coffee, Flame, Sunrise, Moon, Check, X, ShieldCheck, MapPin } from "lucide-react";
import { formatCurrency } from "../../utils/cn";
import { businessConfig } from "../../data/businessConfig";

// 1. LIVE BALEHALLI CLIMATE / WEATHER WIDGET
export const WeatherPill: React.FC = () => {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF8F2] text-xs shadow-sm">
      <Sun className="w-3.5 h-3.5 text-[#C39A58] animate-spin-slow" />
      <span>Balehalli: <strong>21°C</strong> • Misty Hills &amp; Pleasant</span>
    </div>
  );
};

// 2. DAY IN THE LIFE TIMELINE
export const DayInTheLifeTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const itinerary = [
    {
      time: "07:00 AM",
      period: "Morning",
      title: "Wake to Songbirds & Filter Coffee",
      description: "Step out onto the veranda to the melodies of local Malnad songbirds. Sip steaming, freshly ground plantation coffee brewed from surrounding estate beans.",
      icon: Sunrise,
      badge: "Pure Malnad Brew",
    },
    {
      time: "08:30 AM",
      period: "Breakfast",
      title: "Traditional Home-Cooked Breakfast",
      description: "Enjoy hot regional delicacies like Akki Rotti with spicy chutney, steaming Idlis, or fragrant Neer Dosa freshly prepared in the homestay kitchen.",
      icon: Coffee,
      badge: "Included in ₹2,000 Pkg",
    },
    {
      time: "11:00 AM",
      period: "Afternoon",
      title: "Coffee Trail & Shaded Estate Walk",
      description: "Take an unhurried, peaceful walk among Arabica and Robusta shrubs, climbing pepper vines, and towering silver oak shade trees.",
      icon: Compass,
      badge: "Nature Immersion",
    },
    {
      time: undefined,
      period: "Evening",
      title: "A Quiet Golden Hour",
      description: "As the light softens over the coffee canopy, unwind with freshly brewed tea and light regional snacks.",
      icon: Sun,
      badge: "Flexible Evening",
    },
    {
      time: "07:30 PM",
      period: "Night",
      title: "Campfire & Traditional Dinner",
      description: "Gather around the warm outdoor fireplace under starlit skies, followed by a comforting, authentic Malnad dinner cooked with local herbs and spices.",
      icon: Flame,
      badge: "Under the Stars",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E4DC] pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
            Stay Experience
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-1">
            A Day in the Life at Ardya
          </h3>
        </div>
        <p className="text-xs text-[#74796F]">
          Click each step to preview the daily rhythm of your stay
        </p>
      </div>

      {/* Horizontal Step Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {itinerary.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-[#234B36] bg-[#234B36] text-white shadow-md -translate-y-0.5"
                  : "border-[#E5E4DC] bg-[#FAF8F2] text-[#26332A] hover:border-[#C39A58]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-[#C39A58]" : "text-[#74796F]"}`}>
                  {item.time || item.period}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#C39A58]" : "text-[#234B36]"}`} />
              </div>
              <p className="font-semibold text-xs truncate">{item.period}</p>
            </button>
          );
        })}
      </div>

      {/* Active Step Highlight Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C39A58] text-[#234B36] text-[10px] font-bold uppercase tracking-wider">
              {itinerary[activeStep].badge}
            </span>
            {itinerary[activeStep].time && (
              <span className="text-xs text-[#74796F] font-semibold">
                {itinerary[activeStep].time}
              </span>
            )}
          </div>
          <h4 className="font-serif text-xl font-bold text-[#26332A]">
            {itinerary[activeStep].title}
          </h4>
          <p className="text-xs text-[#74796F] max-w-2xl leading-relaxed">
            {itinerary[activeStep].description}
          </p>
        </div>
      </div>
    </div>
  );
};

// 3. DRIVE TIME & DISTANCE CALCULATOR FROM FEEDER CITIES
export const DriveTimeCalculator: React.FC = () => {
  const routes = [
    {
      city: "Bangalore",
      distance: "~245 km",
      time: "~4.5 hrs",
      route: "via NH75 (Nelamangala - Hassan - Mudigere)",
      recommendation: "Smooth 4-lane highway up to Hassan, scenic ghat road thereafter.",
    },
    {
      city: "Mangalore",
      distance: "~120 km",
      time: "~3 hrs",
      route: "via Charmadi Ghat scenic highway",
      recommendation: "Breathtaking mountain views, waterfalls & tea estate bends.",
    },
    {
      city: "Mysore",
      distance: "~175 km",
      time: "~3.5 hrs",
      route: "via Holenarasipura & Belur route",
      recommendation: "Scenic rural highway with heritage temple stops along the drive.",
    },
    {
      city: "Chikkamagaluru",
      distance: "~38 km",
      time: "~50 mins",
      route: "via Mudigere road",
      recommendation: "Quick, smooth road through continuous coffee estate corridors.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E4DC] p-4 sm:p-7 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#E5E4DC]/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF8F2] border border-[#E5E4DC] mb-1">
            <Car className="w-3 h-3 text-[#C39A58]" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#C39A58]">
              Road Trip Navigator
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#234B36]">
            Driving Distance &amp; Travel Times
          </h3>
        </div>
        <p className="text-[11px] text-[#74796F]">
          Well-connected paved roads suitable for all cars &amp; bikes
        </p>
      </div>

      {/* Compact Responsive Route Cards: 2x2 grid on mobile & tablet, 4 cols on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {routes.map((r, i) => (
          <div
            key={i}
            className="p-3 sm:p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] hover:border-[#234B36]/50 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-serif font-bold text-sm sm:text-base text-[#26332A] truncate">
                  {r.city}
                </span>
                <span className="shrink-0 p-1 rounded-md bg-white border border-[#E5E4DC] text-[#234B36]">
                  <Car className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-serif text-lg sm:text-xl font-bold text-[#234B36]">{r.time}</p>
                <span className="text-[10px] font-semibold text-[#C39A58]">{r.distance}</span>
              </div>
              <p className="text-[10px] text-[#74796F] mt-1 leading-snug line-clamp-2">{r.route}</p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E5E4DC]/80 text-[9.5px] text-[#74796F]/90 italic leading-tight line-clamp-2">
              {r.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* GPS Coordinates Bar */}
      <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-[#26332A]">
          <MapPin className="w-3.5 h-3.5 text-[#C39A58] shrink-0" />
          <span>Coordinates: <strong>Balehalli, Karnataka (577111)</strong></span>
        </div>
        <a
          href={businessConfig.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#234B36] font-bold underline hover:text-[#C39A58] self-start sm:self-auto"
        >
          Open GPS Directions →
        </a>
      </div>
    </div>
  );
};

// 4. TRANSPARENT WHAT'S INCLUDED VS EXCLUDED COMPARISON TABLE
export const PackageComparisonTable: React.FC = () => {
  const [selectedMobilePkg, setSelectedMobilePkg] = useState<"meals" | "stay">("meals");

  const features = [
    { name: "Homestay Accommodation", stayOnly: true, stayWithMeals: true },
    { name: "Complimentary Malnad Breakfast", stayOnly: false, stayWithMeals: true },
    { name: "Authentic Home-Cooked Dinner", stayOnly: false, stayWithMeals: true },
    { name: "Fresh Plantation Filter Coffee", stayOnly: false, stayWithMeals: true },
    { name: "24/7 Geyser Hot Water", stayOnly: true, stayWithMeals: true },
    { name: "Outdoor Veranda & Common Lawn", stayOnly: true, stayWithMeals: true },
    { name: "Evening Campfire Sit-out", stayOnly: true, stayWithMeals: true },
    { name: "Secure On-Site Vehicle Parking", stayOnly: true, stayWithMeals: true },
    { name: "Lunch (Available on request)", stayOnly: false, stayWithMeals: false },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-10 shadow-sm space-y-6">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
          Transparent Comparison
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-1">
          Compare Stay Packages Side by Side
        </h3>
        <p className="text-xs text-[#74796F] mt-1">
          Zero hidden surcharges. Clear inclusions for both packages.
        </p>
      </div>

      {/* Mobile Card View (No Horizontal Overflow) */}
      <div className="block sm:hidden space-y-4">
        {/* Toggle Switch */}
        <div className="flex bg-[#FAF8F2] p-1 rounded-xl border border-[#E5E4DC]">
          <button
            type="button"
            onClick={() => setSelectedMobilePkg("meals")}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              selectedMobilePkg === "meals"
                ? "bg-[#234B36] text-white shadow-xs"
                : "text-[#74796F]"
            }`}
          >
            Stay + Meals (₹2,000)
          </button>
          <button
            type="button"
            onClick={() => setSelectedMobilePkg("stay")}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              selectedMobilePkg === "stay"
                ? "bg-[#234B36] text-white shadow-xs"
                : "text-[#74796F]"
            }`}
          >
            Stay Only (₹1,500)
          </button>
        </div>

        {/* Feature List for Selected Package */}
        <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] space-y-2.5">
          <div className="flex items-baseline justify-between border-b border-[#E5E4DC] pb-2">
            <span className="font-serif font-bold text-base text-[#234B36]">
              {selectedMobilePkg === "meals" ? "Stay + Meals Package" : "Stay Only Package"}
            </span>
            <span className="font-serif text-lg font-extrabold text-[#234B36]">
              {selectedMobilePkg === "meals" ? "₹2,000" : "₹1,500"}
              <span className="text-[10px] text-[#74796F] font-normal block text-right">/ person / night</span>
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {features.map((f, i) => {
              const isIncluded = selectedMobilePkg === "meals" ? f.stayWithMeals : f.stayOnly;
              return (
                <div key={i} className="flex items-center justify-between py-1 border-b border-[#E5E4DC]/50 last:border-0">
                  <span className={`text-[11px] ${isIncluded ? "text-[#26332A] font-medium" : "text-[#74796F]"}`}>
                    {f.name}
                  </span>
                  {isIncluded ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-[10px] shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Included</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 text-[10px] shrink-0">
                      {f.name.includes("Lunch") ? "On Request" : "Not Included"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E4DC]">
              <th className="py-3 px-4 font-bold text-[#26332A] uppercase text-[11px]">Feature / Service</th>
              <th className="py-3 px-4 text-center font-bold text-[#26332A] bg-[#FAF8F2] rounded-t-xl">
                Stay Only
                <span className="block font-serif text-base font-extrabold text-[#234B36] mt-0.5">₹1,500</span>
                <span className="block text-[10px] text-[#74796F] font-normal">/ person / night</span>
              </th>
              <th className="py-3 px-4 text-center font-bold text-[#234B36] bg-[#234B36]/10 rounded-t-xl border-x border-[#234B36]/20">
                Stay + Complimentary Meals
                <span className="block font-serif text-base font-extrabold text-[#234B36] mt-0.5">₹2,000</span>
                <span className="block text-[10px] text-[#74796F] font-normal">/ person / night</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E4DC]">
            {features.map((f, i) => (
              <tr key={i} className="hover:bg-[#FAF8F2]/60">
                <td className="py-3 px-4 font-medium text-[#26332A]">{f.name}</td>
                <td className="py-3 px-4 text-center bg-[#FAF8F2]">
                  {f.stayOnly ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4 text-center bg-[#234B36]/5 border-x border-[#234B36]/10 font-semibold text-[#234B36]">
                  {f.stayWithMeals ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <span className="text-[10px] text-[#74796F]">On Prior Request</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
