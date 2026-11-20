import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SafeImage } from "../common/SafeImage";
import { getActivePricingConfig, RoomCategory } from "../../data/pricingConfig";
import { defaultRooms } from "../../data/rooms";
import { propertyPhotos } from "../../data/propertyPhotos";
import { formatCurrency } from "../../utils/cn";
import {
  Check,
  BedDouble,
  ArrowRight,
  Sparkles,
  Users,
  Coffee,
  ShieldCheck,
  Maximize2,
  Calendar,
} from "lucide-react";

interface CategoryComparisonProps {
  onSelectCategory?: (category: RoomCategory) => void;
}

export const RegularVsPremiumComparison: React.FC<CategoryComparisonProps> = ({
  onSelectCategory,
}) => {
  const [mobileCategory, setMobileCategory] = useState<RoomCategory>("Regular");
  const [pricing, setPricing] = useState(getActivePricingConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setPricing(getActivePricingConfig());
    };
    window.addEventListener("ardya-pricing-updated", handleUpdate);
    window.addEventListener("ardya-config-updated", handleUpdate);
    return () => {
      window.removeEventListener("ardya-pricing-updated", handleUpdate);
      window.removeEventListener("ardya-config-updated", handleUpdate);
    };
  }, []);

  const regularRooms = defaultRooms.filter((r) => r.category === "Regular");
  const premiumRooms = defaultRooms.filter((r) => r.category === "Premium");

  // Comparison feature list strictly verified from real property
  const comparisonFeatures = [
    {
      feature: "Coffee Variety Dedicated",
      regular: "Arabica",
      premium: "Robusta",
      highlight: true,
    },
    {
      feature: "Starting Rate (Stay Only)",
      regular: `₹${pricing.Regular.startingPrice.toLocaleString("en-IN")} / person / night`,
      premium: `₹${pricing.Premium.startingPrice.toLocaleString("en-IN")} / person / night`,
      highlight: true,
    },
    {
      feature: "Stay with Meals (B'fast & Dinner)",
      regular: `₹${pricing.Regular.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")} / person / night`,
      premium: `₹${pricing.Premium.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")} / person / night`,
      highlight: true,
    },
    {
      feature: "Available Rooms",
      regular: "Arabica 1 & Arabica 2",
      premium: "Robusta Premium 1 & Robusta Premium 2",
    },
    {
      feature: "Room Proportions & Space",
      regular: "Cozy retreat layout",
      premium: "Extra-spacious layout with seating corner",
    },
    {
      feature: "Primary Bed Configuration",
      regular: "Queen / Double bed + extra bedding",
      premium: "King-size bed + sofa / extra mattress",
    },
    {
      feature: "En-suite Bathroom & 24/7 Geyser",
      regular: true,
      premium: true,
    },
    {
      feature: "Veranda & Outdoor Plantation Access",
      regular: "Common veranda & garden lawn",
      premium: "Direct elevated veranda & valley corridor",
    },
    {
      feature: "Fresh Filter Coffee & Campfire",
      regular: true,
      premium: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#234B36]/10 text-[#234B36] text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C39A58]" />
          <span>Room Comparison</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#234B36] tracking-tight">
          Regular vs Premium Rooms
        </h2>
        <p className="text-xs sm:text-sm text-[#74796F] mt-2 leading-relaxed">
          Choose between our intimate <strong>Arabica Regular Rooms</strong> and spacious <strong>Robusta Premium Suites</strong>.
          Both feature private attached bathrooms, hot water, and tranquil plantation surroundings.
        </p>
      </div>

      {/* Two Cards Side by Side (Desktop) / Stacked Vertically (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
        {/* CARD 1: REGULAR ROOMS (Arabica) */}
        <div data-scroll-reveal="card" className="bg-white rounded-3xl border-2 border-[#E5E4DC] hover:border-[#234B36] transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg">
          <div>
            {/* Image Header with Badge */}
            <div className="h-56 sm:h-64 relative overflow-hidden bg-gray-100">
              <SafeImage
                src={regularRooms[0]?.coverImage || propertyPhotos.rooms["arabica-1"].cover}
                alt="Ardya Homestays Regular Room - Arabica"
                fallbackTitle="Arabica Regular Room"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-[#234B36] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Variety: Arabica
              </div>
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-[#234B36] shadow-md">
                2 Rooms Available
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
                  Category: Regular Rooms
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#26332A] mt-0.5">
                  Arabica Regular
                </h3>
                <p className="text-xs text-[#74796F] mt-1.5 leading-relaxed">
                  Cozy, peaceful rooms surrounded by blooming coffee flora. Ideal for couples, solo nature lovers, or small families.
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC]">
                <span className="text-[10px] uppercase font-bold text-[#74796F] block">
                  Starting Price
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="font-serif text-3xl font-extrabold text-[#234B36]">
                    ₹{pricing.Regular.startingPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#74796F] font-normal">
                    / person / night (Stay Only)
                  </span>
                </div>
                <p className="text-[11px] text-[#536B45] font-semibold mt-1">
                  Stay + Meals: ₹{pricing.Regular.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")} / person
                </p>
              </div>

              {/* Verified Room Highlights */}
              <div className="space-y-2 text-xs text-[#26332A]">
                <div className="flex items-center space-x-2.5">
                  <BedDouble className="w-4 h-4 text-[#C39A58] shrink-0" />
                  <span>Rooms: <strong>Arabica 1</strong> &amp; <strong>Arabica 2</strong></span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-[#C39A58] shrink-0" />
                  <span>Capacity: Up to 4 guests per room</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private attached bathroom with 24/7 hot water</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Garden view windows &amp; tranquil coffee air</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 pt-0 space-y-2.5">
            <Link
              to="/booking?category=Regular"
              onClick={() => onSelectCategory && onSelectCategory("Regular")}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Regular Room (Arabica)</span>
            </Link>

            <Link
              to="/rooms/regular"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold text-[#234B36] hover:text-[#C39A58] transition-colors"
            >
              <span>View Arabica 1 &amp; 2 Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CARD 2: PREMIUM ROOMS (Robusta) */}
        <div data-scroll-reveal="card" className="bg-white rounded-3xl border-2 border-[#C39A58] hover:border-[#234B36] transition-all overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl relative">
          {/* Most Popular / Premium Ribbon */}
          <div className="bg-[#C39A58] text-[#234B36] text-[10px] font-extrabold uppercase tracking-widest text-center py-1.5 px-4">
            Enhanced Living Space • Robusta Variety
          </div>

          <div>
            {/* Image Header with Badge */}
            <div className="h-56 sm:h-64 relative overflow-hidden bg-gray-100">
              <SafeImage
                src={premiumRooms[0]?.coverImage || propertyPhotos.rooms["robusta-premium-1"].cover}
                alt="Ardya Homestays Premium Room - Robusta"
                fallbackTitle="Robusta Premium Room"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-[#234B36] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Variety: Robusta
              </div>
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-[#234B36] shadow-md">
                2 Rooms Available
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
                  Category: Premium Rooms
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#26332A] mt-0.5">
                  Robusta Premium
                </h3>
                <p className="text-xs text-[#74796F] mt-1.5 leading-relaxed">
                  Generous suite layouts, elevated veranda perspectives, and handcrafted wood decor for guests desiring extra space.
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC]">
                <span className="text-[10px] uppercase font-bold text-[#74796F] block">
                  Starting Price
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="font-serif text-3xl font-extrabold text-[#234B36]">
                    ₹{pricing.Premium.startingPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#74796F] font-normal">
                    / person / night (Stay Only)
                  </span>
                </div>
                <p className="text-[11px] text-[#536B45] font-semibold mt-1">
                  Stay + Meals: ₹{pricing.Premium.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")} / person
                </p>
              </div>

              {/* Verified Room Highlights */}
              <div className="space-y-2 text-xs text-[#26332A]">
                <div className="flex items-center space-x-2.5">
                  <BedDouble className="w-4 h-4 text-[#C39A58] shrink-0" />
                  <span>Rooms: <strong>Robusta Premium 1</strong> &amp; <strong>Robusta Premium 2</strong></span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-[#C39A58] shrink-0" />
                  <span>Capacity: Up to 5 guests comfortably</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Spacious en-suite bathroom with hot water</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct veranda sit-out &amp; panoramic estate views</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 pt-0 space-y-2.5">
            <Link
              to="/booking?category=Premium"
              onClick={() => onSelectCategory && onSelectCategory("Premium")}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Premium Suite (Robusta)</span>
            </Link>

            <Link
              to="/rooms/premium"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold text-[#234B36] hover:text-[#C39A58] transition-colors"
            >
              <span>View Robusta 1 &amp; 2 Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Comparison Table Below Cards */}
      <div className="max-w-5xl mx-auto px-4">
        <div data-scroll-reveal="card" className="bg-white rounded-2xl border border-[#E5E4DC] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E5E4DC] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C39A58]">
                Side-by-Side Breakdown
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#234B36]">
                Feature Comparison Table
              </h3>
            </div>
            <p className="text-[11px] text-[#74796F]">
              Direct comparison of room specs &amp; inclusions
            </p>
          </div>

          {/* Mobile View: Toggle Button + Clean Vertical Cards */}
          <div className="block sm:hidden space-y-4">
            <div className="flex bg-[#FAF8F2] p-1 rounded-xl border border-[#E5E4DC]">
              <button
                type="button"
                onClick={() => setMobileCategory("Regular")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  mobileCategory === "Regular"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F]"
                }`}
              >
                Arabica Regular (₹{pricing.Regular.startingPrice.toLocaleString("en-IN")})
              </button>
              <button
                type="button"
                onClick={() => setMobileCategory("Premium")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  mobileCategory === "Premium"
                    ? "bg-[#234B36] text-white shadow-xs"
                    : "text-[#74796F]"
                }`}
              >
                Robusta Premium (₹{pricing.Premium.startingPrice.toLocaleString("en-IN")})
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] divide-y divide-[#E5E4DC]/60 text-xs">
              {comparisonFeatures.map((f, i) => {
                const val = mobileCategory === "Regular" ? f.regular : f.premium;
                return (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-2 first:pt-0 last:pb-0">
                    <span className="text-[11px] text-[#74796F] font-medium">{f.feature}</span>
                    <span className="text-[11px] font-semibold text-[#26332A] text-right">
                      {typeof val === "boolean" ? (
                        val ? (
                          <span className="inline-flex items-center text-emerald-600 space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        val
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop View: Side-by-Side Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E4DC]">
                  <th className="py-2.5 px-3 font-bold text-[#26332A] uppercase text-[10px]">Feature</th>
                  <th className="py-2.5 px-3 font-bold text-[#234B36] bg-[#FAF8F2] rounded-t-xl text-center w-40 sm:w-52">
                    Regular (Arabica)
                    <span className="block font-serif text-base font-extrabold text-[#234B36] mt-0.5">
                      from ₹{pricing.Regular.startingPrice.toLocaleString("en-IN")}
                    </span>
                  </th>
                  <th className="py-2.5 px-3 font-bold text-[#234B36] bg-[#234B36]/10 rounded-t-xl border-x border-[#234B36]/20 text-center w-40 sm:w-56">
                    Premium (Robusta)
                    <span className="block font-serif text-base font-extrabold text-[#234B36] mt-0.5">
                      from ₹{pricing.Premium.startingPrice.toLocaleString("en-IN")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4DC]">
                {comparisonFeatures.map((f, i) => (
                  <tr key={i} className={`hover:bg-[#FAF8F2]/60 ${f.highlight ? "font-semibold" : ""}`}>
                    <td className="py-2.5 px-3 text-[#26332A] text-[11px]">{f.feature}</td>

                    <td className="py-2.5 px-3 text-center bg-[#FAF8F2] text-[#26332A]">
                      {typeof f.regular === "boolean" ? (
                        f.regular ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-[11px]">{f.regular}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center bg-[#234B36]/5 border-x border-[#234B36]/10 text-[#234B36] font-medium">
                      {typeof f.premium === "boolean" ? (
                        f.premium ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="text-[11px]">{f.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
