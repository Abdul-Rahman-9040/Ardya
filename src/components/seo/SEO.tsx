import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { businessConfig } from "../../data/businessConfig";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Ardya Homestays | Homestay in Balehalli, Karnataka",
  description = "Discover Ardya Homestays in Balehalli, Karnataka. Explore four accommodation rooms, compare stay packages with optional meal inclusions and contact us for booking enquiries.",
  canonical = "/",
  keywords = [],
  ogImage = "/images/exterior/main-exterior.jpg",
  ogType = "website",
  schema,
}) => {
  const location = useLocation();

  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update Meta Keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords.join(", "));
    }

    // Update Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", `https://ardyahomestays.com${canonical}`);

    // Update OpenGraph
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", `https://ardyahomestays.com${location.pathname}`);
    setMeta("og:type", ogType);
    setMeta("og:image", ogImage);
    setMeta("og:site_name", businessConfig.name);

    // Handle Schema.org JSON-LD
    let scriptTag = document.getElementById("structured-data-jsonld") as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "structured-data-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      // Default LodgingBusiness Schema
      const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": businessConfig.name,
        "description": description,
        "telephone": `+91${businessConfig.phone}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Balehalli",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        "hasMap": businessConfig.googleMapsUrl,
        "numberOfRooms": businessConfig.totalRooms,
        "priceRange": "₹1500 - ₹2000 per person per night",
        "url": "https://ardyahomestays.com",
        "checkinTime": businessConfig.checkInTime,
        "checkoutTime": businessConfig.checkOutTime
      };
      scriptTag.text = JSON.stringify(defaultSchema);
    }
  }, [title, description, canonical, keywords, ogImage, ogType, schema, location.pathname]);

  return null;
};
