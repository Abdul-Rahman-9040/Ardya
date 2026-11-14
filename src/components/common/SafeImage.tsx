import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  categoryName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = "Ardya Homestays photograph",
  className = "",
  fallbackTitle = "Ardya Homestays Photograph",
  categoryName,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#E5E4DC]/40 border border-[#E5E4DC] text-[#74796F] p-6 text-center select-none ${className}`}
        style={{ minHeight: "220px" }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF8F2] border border-[#E5E4DC] flex items-center justify-center mb-3 shadow-inner">
          <ImageIcon className="w-6 h-6 text-[#536B45]" />
        </div>
        <p className="text-sm font-semibold text-[#26332A]">{fallbackTitle}</p>
        {categoryName && (
          <span className="text-xs uppercase tracking-wider text-[#C39A58] mt-1 font-medium">
            {categoryName}
          </span>
        )}
        <p className="text-[11px] text-[#74796F] mt-2 max-w-xs">
          Ardya Homestays original property photo
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[#E5E4DC]/50 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-[#74796F]/40" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};
