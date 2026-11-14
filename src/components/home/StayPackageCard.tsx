import React from "react";
import { StayPackage } from "../../data/packages";
import { formatCurrency } from "../../utils/cn";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface StayPackageCardProps {
  pkg: StayPackage;
  onSelect?: (packageId: string) => void;
  selected?: boolean;
}

export const StayPackageCard: React.FC<StayPackageCardProps> = ({
  pkg,
  onSelect,
  selected = false,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border p-6 sm:p-8 transition-all duration-300 ${
        selected
          ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-md"
          : "border-[#E5E4DC] bg-white hover:border-[#C39A58] shadow-sm hover:shadow"
      }`}
    >
      {pkg.badge && (
        <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[#C39A58] text-[#234B36] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>{pkg.badge}</span>
        </div>
      )}

      <div>
        <div className="mb-4">
          <h3 className="font-serif text-2xl font-bold text-[#26332A]">
            {pkg.packageName}
          </h3>
          <p className="text-xs text-[#74796F] mt-1">{pkg.tagline}</p>
        </div>

        {/* Pricing block with separate Regular & Premium rates */}
        <div className="py-4 my-2 border-y border-[#E5E4DC]/70 space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-xs font-semibold text-[#74796F]">Regular (Arabica):</span>
            <span className="font-serif text-2xl font-extrabold text-[#234B36]">
              {formatCurrency(pkg.regularPrice)}
            </span>
            <span className="text-[11px] text-[#74796F]">/ person / night</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xs font-semibold text-[#C39A58]">Premium (Robusta):</span>
            <span className="font-serif text-2xl font-extrabold text-[#234B36]">
              {formatCurrency(pkg.premiumPrice)}
            </span>
            <span className="text-[11px] text-[#74796F]">/ person / night</span>
          </div>
        </div>

        <p className="text-xs text-[#74796F] mt-3 leading-relaxed">
          {pkg.description}
        </p>

        {/* Meal Inclusions Badge Summary */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
          <div
            className={`py-2 px-1 rounded border ${
              pkg.breakfastIncluded
                ? "bg-[#234B36]/10 border-[#234B36]/30 text-[#234B36] font-semibold"
                : "bg-gray-50 border-gray-200 text-gray-400"
            }`}
          >
            Breakfast
            <span className="block text-[10px] mt-0.5">
              {pkg.breakfastIncluded ? "Included" : "Excluded"}
            </span>
          </div>

          <div
            className={`py-2 px-1 rounded border ${
              pkg.lunchIncluded
                ? "bg-[#234B36]/10 border-[#234B36]/30 text-[#234B36] font-semibold"
                : "bg-gray-50 border-gray-200 text-gray-400"
            }`}
          >
            Lunch
            <span className="block text-[10px] mt-0.5">
              {pkg.lunchIncluded ? "Included" : "Excluded"}
            </span>
          </div>

          <div
            className={`py-2 px-1 rounded border ${
              pkg.dinnerIncluded
                ? "bg-[#234B36]/10 border-[#234B36]/30 text-[#234B36] font-semibold"
                : "bg-gray-50 border-gray-200 text-gray-400"
            }`}
          >
            Dinner
            <span className="block text-[10px] mt-0.5">
              {pkg.dinnerIncluded ? "Included" : "Excluded"}
            </span>
          </div>
        </div>

        {/* Bullet Inclusions */}
        <div className="mt-6 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#26332A]">
            Package Highlights:
          </p>
          {pkg.inclusions.map((item, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-[#26332A]">
              <Check className="w-3.5 h-3.5 text-[#234B36] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}

          {pkg.exclusions.map((item, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-[#74796F]">
              <X className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E5E4DC]">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(pkg.packageId)}
            className={`w-full py-3 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              selected
                ? "bg-[#234B36] text-white"
                : "bg-[#FAF8F2] hover:bg-[#234B36] text-[#234B36] hover:text-white border border-[#234B36]"
            }`}
          >
            {selected ? "Selected Package" : `Choose ${pkg.packageName}`}
          </button>
        ) : (
          <Link
            to={`/booking?package=${pkg.packageId}`}
            className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-md text-xs font-bold uppercase tracking-wider bg-[#234B36] hover:bg-[#536B45] text-white transition-colors"
          >
            <span>Book with {pkg.packageName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
