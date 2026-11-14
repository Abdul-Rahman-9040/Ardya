import React from "react";
import { SEO } from "../components/seo/SEO";
import { Link } from "react-router-dom";
import { businessConfig } from "../data/businessConfig";
import { Compass, CloudSun, Shirt, Coffee, ArrowRight } from "lucide-react";

export const TravelGuide: React.FC = () => {
  return (
    <div>
      <SEO
        title="Balehalli Travel Guide | Discover Scenic Karnataka with Ardya Homestays"
        description="Comprehensive travel guide to Balehalli and the surrounding coffee hill country of Karnataka. Climate, weather, packing suggestions, and cultural tips."
        canonical="/travel-guide"
      />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C39A58] font-bold">
            Explore the Region
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 mb-4 text-[#FAF8F2]">
            Balehalli Travel Guide
          </h1>
          <p className="text-sm sm:text-base text-[#E5E4DC]/80 max-w-xl mx-auto">
            Everything you need to know to plan a rejuvenating holiday amidst the Western Ghats coffee plantations.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#FAF8F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Guide Item 1: About the Region */}
          <div className="bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-[#234B36]">
              <Compass className="w-6 h-6 text-[#C39A58]" />
              <h2 className="font-serif text-2xl font-bold text-[#26332A]">
                The Charm of Balehalli
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#74796F] leading-relaxed">
              Balehalli is a serene hamlet nestled in the lush verdant slopes of Karnataka's Western Ghats coffee belt. Known for its extensive canopy of Arabica and Robusta coffee estates, silver oak trees, pepper vines, and calm rural lanes, it is an idyllic retreat for travelers looking to escape congested tourist hotspots.
            </p>
            <p className="text-xs sm:text-sm text-[#74796F] leading-relaxed">
              At Ardya Homestays, guests can experience this untouched landscape firsthand: waking up to morning birdsong, strolling along peaceful plantation paths, and enjoying the mist rolling over the hills during dawn and dusk.
            </p>
          </div>

          {/* Guide Item 2: Climate & Best Time */}
          <div className="bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-[#234B36]">
              <CloudSun className="w-6 h-6 text-[#C39A58]" />
              <h2 className="font-serif text-2xl font-bold text-[#26332A]">
                Weather & Seasons
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
                <h4 className="font-serif font-bold text-sm text-[#234B36]">Post-Monsoon & Winter</h4>
                <p className="text-xs text-[#C39A58] font-semibold mt-0.5">October to February</p>
                <p className="text-xs text-[#74796F] mt-2">
                  Cool breezes, misty mornings, crisp evenings. Ideal for estate walks and sitting on the veranda with steaming coffee.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
                <h4 className="font-serif font-bold text-sm text-[#234B36]">Spring & Blossom Season</h4>
                <p className="text-xs text-[#C39A58] font-semibold mt-0.5">March to May</p>
                <p className="text-xs text-[#74796F] mt-2">
                  Pleasant hill warmth during the day, cool nights. Coffee blossom flowering showers fill the air with sweet jasmine fragrance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC]">
                <h4 className="font-serif font-bold text-sm text-[#234B36]">Monsoon Enchantment</h4>
                <p className="text-xs text-[#C39A58] font-semibold mt-0.5">June to September</p>
                <p className="text-xs text-[#74796F] mt-2">
                  Lush emerald landscapes, overflowing streams, and gentle showers. Loved by nature admirers and monsoon lovers.
                </p>
              </div>
            </div>
          </div>

          {/* Guide Item 3: Packing & Preparation */}
          <div className="bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-[#234B36]">
              <Shirt className="w-6 h-6 text-[#C39A58]" />
              <h2 className="font-serif text-2xl font-bold text-[#26332A]">
                What to Pack for Your Stay
              </h2>
            </div>
            <ul className="text-xs sm:text-sm text-[#74796F] space-y-2.5 list-disc list-inside leading-relaxed">
              <li><strong>Footwear:</strong> Comfortable walking shoes or trainers for strolls around the plantation and garden trails.</li>
              <li><strong>Clothing:</strong> Light cottons for sunny days, along with a light jacket, sweater, or shawl for chilly mornings and nights.</li>
              <li><strong>Rain Gear (if visiting June–Sept):</strong> Umbrella or lightweight raincoat.</li>
              <li><strong>Personal Necessities:</strong> Any specific prescription medicines or personal toiletries you prefer during your travels.</li>
            </ul>
          </div>

          {/* Guide Item 4: Food & Regional Flavours */}
          <div className="bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-[#234B36]">
              <Coffee className="w-6 h-6 text-[#C39A58]" />
              <h2 className="font-serif text-2xl font-bold text-[#26332A]">
                Regional Malnad Flavours
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#74796F] leading-relaxed">
              When booking our <strong>Stay with Complimentary Meals (₹2,000 package)</strong>, you will enjoy authentic home-cooked Malnad specialties. Prepared with local garden herbs, fresh coconut, and gentle hill spices, the meals offer a warm glimpse into local culinary heritage.
            </p>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-2xl bg-[#234B36] text-white text-center space-y-4">
            <h3 className="font-serif text-2xl font-bold">
              Ready to Experience Balehalli?
            </h3>
            <p className="text-xs text-[#E5E4DC]/80 max-w-md mx-auto">
              Reserve your room at Ardya Homestays. Transparent packages starting from ₹1,500 per person per night.
            </p>
            <div className="pt-2">
              <Link
                to="/booking"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow"
              >
                <span>Calculate & Enquire Stay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
