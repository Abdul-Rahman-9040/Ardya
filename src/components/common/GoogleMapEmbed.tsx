import React from "react";
import { businessConfig } from "../../data/businessConfig";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";

interface GoogleMapEmbedProps {
  title?: string;
  subtitle?: string;
  heightClass?: string;
  showCard?: boolean;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  title = "Ardya Homestays Location",
  subtitle = "Balehalli, Karnataka",
  heightClass = "h-[420px]",
  showCard = true,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E5E4DC] shadow-sm bg-white">
      {/* Live Interactive Google Maps Embed */}
      <div className={`w-full ${heightClass} relative z-0`}>
        <iframe
          title={title}
          src={businessConfig.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale-[25%] contrast-[1.05] hover:grayscale-0 transition-all duration-500"
        />
      </div>

      {/* Floating Modern Overlay Card */}
      {showCard && (
        <div className="p-5 sm:p-6 bg-white border-t border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C39A58]">
                Verified Google Map Pin
              </span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#26332A]">
              {title}
            </h4>
            <p className="text-xs text-[#74796F] max-w-md">
              {businessConfig.fullAddressNote}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={businessConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md group"
            >
              <Navigation className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
