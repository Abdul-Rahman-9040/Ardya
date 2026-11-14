import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { businessConfig } from "../../data/businessConfig";
import { Menu, X, Phone, MessageCircle, Calendar } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Rooms", path: "/rooms" },
    { name: "Gallery", path: "/gallery" },
    { name: "Location", path: "/location" },
    { name: "Travel Guide", path: "/travel-guide" },
    { name: "FAQs", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Notification Strip - Full Width with iOS safe-area handling */}
      <div className="bg-[#234B36] text-[#FAF8F2] text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 hidden sm:block w-full">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C39A58] animate-pulse"></span>
            <span>Ardya Homestays • Balehalli, Karnataka (PIN 577111)</span>
          </div>

          <div className="flex items-center space-x-5 text-xs">
            <a
              href={`tel:${businessConfig.phone}`}
              className="hover:text-[#C39A58] transition-colors flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-[#C39A58]" />
              <span>{businessConfig.displayPhone}</span>
            </a>

            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors flex items-center space-x-1"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-xl border-b border-[#E5E4DC]/80 w-full px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full max-w-7xl mx-auto">
          {/* Logo / Brand */}
          <Link to="/" className="flex flex-col group min-h-[44px] justify-center">
            <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-[#234B36] group-hover:text-[#536B45] transition-colors">
              Ardya Homestays
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#74796F] font-semibold">
              Balehalli • Karnataka
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-wider font-semibold transition-all relative py-1 min-h-[44px] flex items-center ${
                  isActive(link.path)
                    ? "text-[#234B36]"
                    : "text-[#26332A]/80 hover:text-[#234B36]"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-2 left-0 right-0 h-0.5 bg-[#C39A58] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center space-x-2.5">
            <a
              href={`tel:${businessConfig.phone}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-[#234B36] border border-[#234B36] rounded-xl hover:bg-[#234B36] hover:text-white transition-all shadow-xs min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Host</span>
            </a>

            <Link
              to="/booking"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#234B36] bg-[#C39A58] hover:bg-[#b08745] rounded-xl transition-all shadow hover:-translate-y-0.5 min-h-[44px]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Stay</span>
            </Link>
          </div>

          {/* Mobile Actions: WhatsApp + Book + Hamburger (All ≥44px touch targets) */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center text-white bg-[#25D366] rounded-xl shadow-xs"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <Link
              to="/booking"
              className="h-10 px-3.5 flex items-center justify-center text-xs font-bold text-[#234B36] bg-[#C39A58] rounded-xl shadow-xs"
            >
              Book
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#26332A] hover:bg-[#E5E4DC]/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full Navigation Sheet */}
        {isOpen && (
          <div className="lg:hidden bg-[#FAF8F2] border-b border-[#E5E4DC] px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
                  isActive(link.path)
                    ? "bg-[#234B36] text-white"
                    : "text-[#26332A] hover:bg-[#E5E4DC]/50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-[#E5E4DC] flex gap-2">
              <a
                href={`tel:${businessConfig.phone}`}
                className="flex-1 py-3 bg-[#234B36] text-white text-xs font-bold uppercase rounded-xl text-center min-h-[44px] flex items-center justify-center"
              >
                Call Host
              </a>
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-[#C39A58] text-[#234B36] text-xs font-bold uppercase rounded-xl text-center min-h-[44px] flex items-center justify-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
