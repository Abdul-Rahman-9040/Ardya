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
      time: "05:00 PM",
      period: "Sunset",
      title: "Golden Hour Sunset Over Hills",
      description: "Watch the mist sweep across the coffee canopy as dusk falls. Relax with freshly brewed evening tea and light regional snacks.",
      icon: Sun,
      badge: "Misty Sunset",
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
                  {item.time}
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
            <span className="text-xs text-[#74796F] font-semibold">{itinerary[activeStep].time}</span>
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
      route: "via NH75 (Nelamangala - Hassan - Mudigere route)",
      recommendation: "Smooth 4-lane highway up to Hassan, scenic ghat road thereafter.",
    },
    {
      city: "Mangalore",
      distance: "~120 km",
      time: "~3 hrs",
      route: "via Charmadi Ghat scenic highway",
      recommendation: "Breathtaking mountain views, waterfalls, and tea estate hairpin bends.",
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
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E4DC] pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
            Road Trip Navigator
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-1">
            Driving Distance &amp; Travel Times
          </h3>
        </div>
        <p className="text-xs text-[#74796F]">
          Well-connected paved roads suitable for all cars and bikes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {routes.map((r, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] hover:border-[#234B36] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-lg text-[#26332A]">{r.city}</span>
                <span className="p-1.5 rounded-lg bg-white border border-[#E5E4DC] text-[#234B36]">
                  <Car className="w-4 h-4" />
                </span>
              </div>
              <p className="font-serif text-2xl font-bold text-[#234B36]">{r.time}</p>
              <p className="text-[11px] font-semibold text-[#C39A58] mt-0.5">{r.distance}</p>
              <p className="text-[11px] text-[#74796F] mt-2 leading-relaxed">{r.route}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E4DC]/80 text-[10px] text-[#74796F] italic">
              {r.recommendation}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-[#26332A]">
          <MapPin className="w-4 h-4 text-[#C39A58] shrink-0" />
          <span>Destination coordinates: <strong>Balehalli, Karnataka (577111)</strong></span>
        </div>
        <a
          href={businessConfig.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#234B36] font-bold underline hover:text-[#C39A58] self-start sm:self-auto"
        >
          Open Turn-by-Turn GPS Directions →
        </a>
      </div>
    </div>
  );
};

// 4. TRANSPARENT WHAT'S INCLUDED VS EXCLUDED COMPARISON TABLE
export const PackageComparisonTable: React.FC = () => {
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
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-6">
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

      <div className="overflow-x-auto">
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
