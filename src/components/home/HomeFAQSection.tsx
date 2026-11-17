import React, { useState } from "react";
import { defaultFAQs } from "../../data/faqs";
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { businessConfig } from "../../data/businessConfig";
import { Link } from "react-router-dom";

export const HomeFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-8 sm:py-12 bg-[#FAF8F2] border-t border-[#E5E4DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#234B36]/10 text-[#234B36] text-[11px] font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#C39A58]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#74796F] mt-1 max-w-md mx-auto">
            Clear, transparent answers about our Regular &amp; Premium rooms, pricing packages, and meals.
          </p>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-2.5">
          {defaultFAQs.slice(0, 6).map((faq) => {
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
                  <div className="px-4 sm:px-5 pb-4 pt-0 text-xs sm:text-sm text-[#74796F] leading-relaxed border-t border-[#E5E4DC]/50 mt-1">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5E4DC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#74796F]">
            Need more answers or custom group assistance?
          </p>
          <div className="flex items-center space-x-3">
            <Link
              to="/faq"
              className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#234B36] hover:text-[#C39A58] transition-colors min-h-[44px] px-2"
            >
              <span>View All 10 FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={`https://wa.me/${businessConfig.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#20ba59] transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
