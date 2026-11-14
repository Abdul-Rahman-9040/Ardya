import React from "react";
import { businessConfig } from "../../data/businessConfig";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileStickyBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F2]/95 backdrop-blur-xl border-t border-[#E5E4DC] p-2.5 sm:hidden shadow-lg pb-safe">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        <a
          href={`tel:${businessConfig.phone}`}
          className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-3 bg-white border border-[#234B36] text-[#234B36] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs min-h-[44px]"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Host</span>
        </a>

        <a
          href={`https://wa.me/${businessConfig.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-3 bg-[#25D366] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs min-h-[44px]"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        <Link
          to="/booking"
          className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-3 bg-[#C39A58] text-[#234B36] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md min-h-[44px]"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Stay</span>
        </Link>
      </div>
    </div>
  );
};
