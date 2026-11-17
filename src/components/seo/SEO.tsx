import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { businessConfig } from "../../data/businessConfig";

const siteUrl = "https://ardyahomestays.com";
const defaultSocialImage = `${siteUrl}/images/ardya-hero-poster.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Ardya Homestays | Coffee Estate Homestay in Balehalli, Chikkamagaluru",
  description = "Stay at Ardya Homestays in Balehalli, Chikkamagaluru, Karnataka, with four boutique rooms, coffee-estate surroundings, campfire evenings, and direct booking enquiries.",
  canonical,
  ogImage,
  ogType = "website",
  schema,
}) => {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = new URL(canonical ?? location.pathname, `${siteUrl}/`).href;
    const imageUrl = ogImage
      ? new URL(ogImage, `${siteUrl}/`).href
      : defaultSocialImage;

    document.title = title;

    const setMeta = (
      attribute: "name" | "property",
      key: string,
      content: string
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    );
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", businessConfig.name);
    setMeta("property", "og:locale", "en_IN");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    if (imageUrl) {
      setMeta("property", "og:image", imageUrl);
      setMeta("name", "twitter:image", imageUrl);
    }

    let canonicalLink = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    let scriptTag = document.getElementById(
      "structured-data-jsonld"
    ) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "structured-data-jsonld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const lodgingSchema = {
      "@type": "LodgingBusiness",
      "@id": `${siteUrl}/#lodging`,
      name: businessConfig.name,
      alternateName: ["Ardya Homestay", "Ardya Homestay Balehalli", "Ardya Homestays Chikmagalur"],
      description: businessConfig.tagline,
      url: siteUrl,
      image: imageUrl,
      telephone: `+91${businessConfig.phone}`,
      priceRange: "₹1,500–₹2,500 per person per night",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Net Banking",
      numberOfRooms: businessConfig.totalRooms,
      checkinTime: "12:00:00",
      checkoutTime: "11:00:00",
      hasMap: businessConfig.googleMapsUrl,
      sameAs: [businessConfig.googleMapsUrl],
      geo: {
        "@type": "GeoCoordinates",
        latitude: businessConfig.coordinates.lat,
        longitude: businessConfig.coordinates.lng,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: businessConfig.fullAddressNote,
        addressLocality: "Balehalli",
        addressRegion: "Karnataka",
        postalCode: "577111",
        addressCountry: "IN",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", "name": "Coffee Estate Walk", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Campfire Evening", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Home-Cooked Malnad Meals", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "24/7 Hot Water Geyser", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Attached Private Washrooms", "value": true }
      ]
    };
    const graph: object[] = [
      lodgingSchema,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: businessConfig.name,
        publisher: { "@id": `${siteUrl}/#lodging` },
      },
    ];

    if (schema) {
      const pageSchema: Record<string, unknown> = { ...schema };
      delete pageSchema["@context"];
      pageSchema["@id"] ??= `${canonicalUrl}#page-schema`;
      graph.push(pageSchema);
    }

    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [title, description, canonical, ogImage, ogType, schema, location.pathname]);

  return null;
};
