import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileStickyBar } from "./components/layout/MobileStickyBar";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { UnifiedRoomsBookingPage } from "./pages/UnifiedRoomsBookingPage";
import { CategoryRoomPage } from "./pages/CategoryRoomPage";
import { Gallery } from "./pages/Gallery";
import { LocationPage } from "./pages/Location";
import { TravelGuide } from "./pages/TravelGuide";
import { FAQPage } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";
import { ScrollReveal } from "./components/common/ScrollReveal";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#26332A] pb-16 lg:pb-0">
      <Navbar />
      <main id="main-content" className="flex-1">
        <ScrollReveal key={location.pathname}>{children}</ScrollReveal>
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Navbar, Footer and Mobile Sticky Bar */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        
        {/* Unified 1-Page Rooms & Booking Experience */}
        <Route path="/rooms" element={<PublicLayout><UnifiedRoomsBookingPage /></PublicLayout>} />
        <Route path="/booking" element={<PublicLayout><UnifiedRoomsBookingPage /></PublicLayout>} />
        
        {/* Category Routes with Regular & Premium support */}
        <Route path="/rooms/regular" element={<PublicLayout><CategoryRoomPage category="Regular" /></PublicLayout>} />
        <Route path="/rooms/arabica" element={<PublicLayout><CategoryRoomPage category="Regular" /></PublicLayout>} />
        <Route path="/rooms/premium" element={<PublicLayout><CategoryRoomPage category="Premium" /></PublicLayout>} />
        <Route path="/rooms/robusta-premium" element={<PublicLayout><CategoryRoomPage category="Premium" /></PublicLayout>} />
        
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/location" element={<PublicLayout><LocationPage /></PublicLayout>} />
        <Route path="/travel-guide" element={<PublicLayout><TravelGuide /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="py-24 text-center max-w-md mx-auto px-4">
                <h1 className="font-serif text-5xl font-bold text-[#234B36] mb-3">404</h1>
                <p className="text-sm text-[#74796F] mb-6">
                  The page you requested could not be found. Let us guide you back home.
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-[#234B36] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow"
                >
                  Return to Homepage
                </a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
