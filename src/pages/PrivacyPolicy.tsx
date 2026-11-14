import React from "react";
import { businessConfig } from "../data/businessConfig";
import { SEO } from "../components/seo/SEO";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <SEO
        title="Privacy Policy | Ardya Homestays"
        description="Privacy policy and data protection guidelines for guests and visitors of Ardya Homestays in Balehalli, Karnataka."
        canonical="/privacy-policy"
      />

      <section className="bg-[#234B36] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF8F2]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4DC]/80 mt-2">
            Last Updated: November 2026 • {businessConfig.name}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FAF8F2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 bg-white rounded-2xl border border-[#E5E4DC] p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-[#74796F] leading-relaxed">
          <h2 className="font-serif text-xl font-bold text-[#26332A]">1. Introduction</h2>
          <p>
            At <strong>{businessConfig.name}</strong>, located in Balehalli, Karnataka, we value your privacy and trust. This policy describes how we collect, store, and handle your contact information when you use our website or submit a stay enquiry.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#26332A]">2. Information We Collect</h2>
          <p>
            When you complete an enquiry form on our website, we may collect:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your full name</li>
            <li>Your contact phone number (and WhatsApp number)</li>
            <li>Your email address (if voluntarily provided)</li>
            <li>Stay dates, number of guests, and room/package preferences</li>
            <li>Any specific dietary or special stay requests</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-[#26332A]">3. How Your Information is Used</h2>
          <p>
            The information submitted is strictly utilized for hospitality communication:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>To review room availability and verify your requested dates</li>
            <li>To communicate driving directions, check-in instructions, and meal preparations</li>
            <li>To provide customer support before, during, and after your stay</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-[#26332A]">4. Data Protection & Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal details with third-party marketers or advertising networks. Your information is retained solely by Ardya Homestays management for operational purposes.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#26332A]">5. Contact Us</h2>
          <p>
            If you have questions about this privacy statement or wish to update any details you shared with us, please contact us at:
          </p>
          <p className="font-medium text-[#26332A]">
            {businessConfig.name}<br />
            Balehalli, Karnataka<br />
            Phone: {businessConfig.displayPhone}
          </p>
        </div>
      </section>
    </div>
  );
};
