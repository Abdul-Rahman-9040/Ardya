import React, { useState } from "react";
import { defaultFAQs, FAQItem } from "../data/faqs";
import { SEO } from "../components/seo/SEO";
import { ChevronDown, HelpCircle, Phone, MessageCircle, Sparkles } from "lucide-react";
import { businessConfig } from "../data/businessConfig";
import { Link } from "react-router-dom";

export const FAQPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": defaultFAQs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="w-full overflow-x-hidden">
      <SEO
        title="Frequently Asked Questions | Ardya Homestays – Pricing, Rooms & Location"
        description="Clear answers about Ardya Homestays: Regular Rooms (from ₹1,500), Premium Suites (from ₹2,000), complimentary meals, child pricing policy, and Balehalli directions."
        canonical="/faq"
        schema={faqSchema}
      />

      {/* Header Banner */}
      <section className="bg-[#234B36] text-white py-14 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C39A58]/20 text-[#C39A58] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Help &amp; Transparency</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F2]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#E5E4DC]/80 max-w-xl mx-auto leading-relaxed">
            Verified answers about our Regular &amp; Premium rooms, transparent pricing packages, meal inclusions, and reaching Balehalli.
          </p>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-12 sm:py-16 bg-[#FAF8F2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-3">
            {defaultFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#E5E4DC] overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-4 focus:outline-none min-h-[44px]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-[#26332A]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#234B36] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-[#74796F] leading-relaxed border-t border-[#E5E4DC]/60 mt-1">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Box */}
          <div className="mt-12 p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E4DC] text-center space-y-3 shadow-xs">
            <HelpCircle className="w-7 h-7 text-[#C39A58] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#26332A]">
              Have More Questions?
            </h3>
            <p className="text-xs text-[#74796F] max-w-md mx-auto leading-relaxed">
              We are available directly on phone and WhatsApp to help you plan your travel, meals, and room selection.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${businessConfig.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {businessConfig.displayPhone}</span>
              </a>

              <a
                href={`https://wa.me/${businessConfig.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </a>

              <Link
                to="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 border border-[#234B36] text-[#234B36] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors min-h-[44px]"
              >
                <span>Book Stay</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
