import React from "react";
import { Link } from "react-router-dom";
import { businessConfig } from "../../data/businessConfig";
import { Phone, MessageCircle, MapPin, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#234B36] text-[#FAF8F2] pt-12 pb-10 border-t border-[#345e47]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          {/* Identity */}
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F2]">
              {businessConfig.name}
            </h3>
            <p className="text-xs text-[#E5E4DC]/80 max-w-sm">
              Boutique coffee homestay with 4 private rooms in Balehalli, Karnataka.
            </p>
          </div>

          {/* Essential Quick Links Only */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#E5E4DC]/90">
            <Link to="/rooms" className="hover:text-[#C39A58] transition-colors">
              Rooms
            </Link>
            <Link to="/gallery" className="hover:text-[#C39A58] transition-colors">
              Gallery
            </Link>
            <Link to="/location" className="hover:text-[#C39A58] transition-colors">
              Location
            </Link>
            <Link to="/faq" className="hover:text-[#C39A58] transition-colors">
              FAQs
            </Link>
            <Link to="/contact" className="hover:text-[#C39A58] transition-colors">
              Contact
            </Link>
          </div>

          {/* Quick Direct Actions */}
          <div className="flex items-center space-x-3">
            <a
              href={`tel:${businessConfig.phone}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF8F2] text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C39A58]" />
              <span>{businessConfig.displayPhone}</span>
            </a>

            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E5E4DC]/60 gap-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#C39A58]" />
            <span>Balehalli, Karnataka • Directions on Google Maps</span>
          </div>

          <div className="flex items-center space-x-5">
            <span>© {new Date().getFullYear()} {businessConfig.name}</span>
            <a
              href="tel:+918217466139"
              title="+91 8217466139"
              aria-label="Developed by crea8ers. Phone: +91 8217466139"
              className="group relative inline-flex items-center gap-1.5 text-[#E5E4DC]/75 transition-colors hover:text-white focus-visible:text-white"
            >
              <Sparkles className="h-3 w-3 text-[#C39A58]" />
              <span>
                Developed by{" "}
                <span className="font-bold tracking-wide text-[#E4C58C]">
                  crea8ers
                </span>
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#17281F] px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                +91 8217466139
              </span>
            </a>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
