import React from "react";
import { businessConfig } from "../data/businessConfig";
import { SEO } from "../components/seo/SEO";
import { SafeImage } from "../components/common/SafeImage";
import { MapPin, Phone, MessageCircle, Trees, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { propertyPhotos } from "../data/propertyPhotos";

export const About: React.FC = () => {
  return (
    <div>
      <SEO
        title="About Us | Ardya Homestays – Balehalli, Karnataka"
        description="Learn about Ardya Homestays: a boutique four-room homestay surrounded by coffee estates in Balehalli, Karnataka."
        canonical="/about"
      />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C39A58] font-bold">
            Our Story & Setting
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 mb-4 text-[#FAF8F2]">
            About Ardya Homestays
          </h1>
          <p className="text-sm sm:text-base text-[#E5E4DC]/80 max-w-xl mx-auto">
            A tranquil four-room haven situated amidst the misty coffee plantations of Balehalli, Karnataka.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 text-sm text-[#74796F] leading-relaxed">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
                Boutique Hospitality
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#234B36]">
                Rooted in Coffee Country Simplicity
              </h2>
              <p>
                Ardya Homestays was created with a clear philosophy: offer discerning travelers an authentic, peaceful sanctuary in Balehalli where the rhythm of everyday life slows to the rustling of coffee leaves and songbirds.
              </p>
              <p>
                Unlike massive commercial resorts, Ardya Homestays keeps accommodation limited to just four thoughtfully arranged rooms: two in the <strong>Arabica</strong> category and two in the <strong>Robusta Premium</strong> category. This ensures personal privacy, quiet corners, and attentive service for every visiting guest.
              </p>
              <p>
                Whether you visit to unwind with a good book on the veranda, hike through nearby plantation trails, or savor freshly prepared local Malnad delicacies, our homestay provides the genuine warmth of a home in the hills.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#E5E4DC] shadow-md">
                <SafeImage
                  src={propertyPhotos.featuredExterior}
                  alt="Ardya Homestays surroundings Balehalli"
                  fallbackTitle="Estate Surroundings"
                  categoryName="Nature & Foliage"
                  className="w-full h-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="py-20 bg-white border-y border-[#E5E4DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C39A58]">
              Why Stay With Us
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#234B36] mt-2 mb-4">
              Our Core Hospitality Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
              <div className="w-12 h-12 rounded-lg bg-[#234B36]/10 text-[#234B36] flex items-center justify-center mb-5">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26332A] mb-3">
                Intimate & Peaceful
              </h3>
              <p className="text-xs text-[#74796F] leading-relaxed">
                With only 4 total rooms, the atmosphere remains tranquil, free of crowded dining halls and resort commotion.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
              <div className="w-12 h-12 rounded-lg bg-[#234B36]/10 text-[#234B36] flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26332A] mb-3">
                Authentic Food
              </h3>
              <p className="text-xs text-[#74796F] leading-relaxed">
                Enjoy home-style Malnad dishes cooked with regional spices, paired with pure plantation-grown filter coffee.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
              <div className="w-12 h-12 rounded-lg bg-[#234B36]/10 text-[#234B36] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#26332A] mb-3">
                Honest Transparency
              </h3>
              <p className="text-xs text-[#74796F] leading-relaxed">
                Clear package rates (₹1,500 and ₹2,000 per person per night) with zero hidden service markups or unexpected fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-16 bg-[#234B36] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold">Have Any Questions for Us?</h2>
          <p className="text-sm text-[#E5E4DC]/80 max-w-lg mx-auto">
            We are always happy to answer route questions, group requests, and date availability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/rooms"
              className="px-6 py-3 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Browse Rooms
            </Link>
            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${businessConfig.phone}`}
              className="px-6 py-3 border border-white/40 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>{businessConfig.displayPhone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
