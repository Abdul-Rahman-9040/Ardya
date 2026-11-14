import React, { useState, useEffect } from "react";
import { defaultRooms, Room } from "../../data/rooms";
import { businessConfig } from "../../data/businessConfig";
import {
  getActivePricingConfig,
  calculateDynamicStayPrice,
  RoomCategory,
  PackageType,
  StayCalculationResult,
} from "../../data/pricingConfig";
import { formatCurrency } from "../../utils/cn";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  Calendar,
  Users,
  AlertCircle,
  Loader2,
  Sparkles,
  BedDouble,
  Check,
  ShieldCheck,
  Info,
} from "lucide-react";
import { submitBookingEnquiry, BookingEnquiryPayload } from "../../services/enquiryService";

interface BookingFormProps {
  initialCategory?: RoomCategory;
  initialRoomId?: string;
  initialPackageType?: PackageType;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialCategory = "Regular",
  initialRoomId = "arabica-1",
  initialPackageType = "stay-with-meals",
}) => {
  const [guestName, setGuestName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Dates
  const today = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrowDate);

  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Category, Room and Package selection
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>(initialCategory);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId);
  const [selectedPackageType, setSelectedPackageType] = useState<PackageType>(initialPackageType);

  // Dynamic pricing state (auto-reloads on custom event)
  const [pricingConfig, setPricingConfig] = useState(getActivePricingConfig());

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Listen to admin price updates
  useEffect(() => {
    const handlePriceUpdate = () => {
      setPricingConfig(getActivePricingConfig());
    };
    window.addEventListener("ardya-pricing-updated", handlePriceUpdate);
    return () => window.removeEventListener("ardya-pricing-updated", handlePriceUpdate);
  }, []);

  // Filter available rooms strictly by selected category
  const availableRoomsForCategory = defaultRooms.filter((r) => r.category === selectedCategory);

  // Whenever category changes, ensure selectedRoomId is valid for that category
  useEffect(() => {
    const currentRoomBelongs = availableRoomsForCategory.some((r) => r.id === selectedRoomId);
    if (!currentRoomBelongs && availableRoomsForCategory.length > 0) {
      setSelectedRoomId(availableRoomsForCategory[0].id);
    }
  }, [selectedCategory, availableRoomsForCategory, selectedRoomId]);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);

  // Centralized price calculation
  const calcResult: StayCalculationResult = calculateDynamicStayPrice({
    category: selectedCategory,
    packageType: selectedPackageType,
    nights: calculatedNights,
    adults,
    children,
    customConfig: pricingConfig,
  });

  const selectedRoom: Room =
    defaultRooms.find((r) => r.id === selectedRoomId) || availableRoomsForCategory[0] || defaultRooms[0];

  const totalGuests = adults + children;

  // Build high-converting, crystal-clear WhatsApp message
  const buildEnquiryMessage = () => {
    const guestLabel = `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""} (under 12)` : ""}`;
    const nameLine = guestName.trim() ? `• Guest Name: ${guestName.trim()}\n` : "";

    return (
      `*Ardya Homestays – Booking Availability Enquiry*\n` +
      `Location: Balehalli, Karnataka\n\n` +
      `• Category: ${selectedCategory} Rooms\n` +
      `• Variety: ${selectedRoom.variety} Coffee Variety\n` +
      `• Room Name: ${selectedRoom.name}\n` +
      `• Package: ${calcResult.packageName}\n` +
      `• Check-in: ${checkIn}\n` +
      `• Check-out: ${checkOut} (${calcResult.nights} Night${calcResult.nights > 1 ? "s" : ""})\n` +
      `• Guests: ${guestLabel}\n` +
      `${nameLine}` +
      `• Applicable Rate: ₹${calcResult.ratePerPerson.toLocaleString("en-IN")}/person/night\n` +
      `• Price Breakdown: ${calcResult.calculationBreakdown}\n` +
      `• Total Estimated: ₹${calcResult.totalEstimatedPrice.toLocaleString("en-IN")}\n\n` +
      `Please let us know availability and confirm our dates. Thank you!`
    );
  };

  const getWhatsAppUrl = () => {
    return `https://wa.me/${businessConfig.phone}?text=${encodeURIComponent(buildEnquiryMessage())}`;
  };

  const handleEnquireAndSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMessage("Check-out date must be strictly after the check-in date.");
      return;
    }

    if (!selectedRoomId) {
      setErrorMessage("Please select a specific room for your stay.");
      return;
    }

    setIsSubmitting(true);

    const payload: BookingEnquiryPayload = {
      guestName: guestName.trim() || "Guest (WhatsApp Enquiry)",
      mobileNumber: mobileNumber.replace(/\D/g, "") || "Direct WhatsApp",
      checkIn,
      checkOut,
      adults: Number(adults),
      children: Number(children),
      roomId: selectedRoom.id,
      roomName: `${selectedRoom.name} (${selectedCategory} - ${selectedRoom.variety})`,
      packageId: selectedPackageType,
      packageName: calcResult.packageName,
      pricePerPerson: calcResult.ratePerPerson,
      numberOfNights: calcResult.nights,
      totalGuests,
      estimatedTotal: calcResult.totalEstimatedPrice,
    };

    // Open WhatsApp prefilled directly
    window.open(getWhatsAppUrl(), "_blank", "noopener,noreferrer");

    try {
      const response = await submitBookingEnquiry(payload);
      const enqId = response.enquiryId || "ENQ-" + Math.floor(100000 + Math.random() * 900000);
      setSubmittedSuccess(enqId);
    } catch {
      setSubmittedSuccess("ENQ-" + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryConfig = pricingConfig[selectedCategory];

  return (
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-8 shadow-xl">
      {submittedSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C39A58] font-bold">
              Enquiry Form Submitted
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#26332A] mt-1">
              WhatsApp Pre-filled &amp; Opened!
            </h3>
            <p className="text-xs text-[#74796F] max-w-sm mx-auto mt-1 leading-relaxed">
              We have initiated WhatsApp with your exact stay dates, room (<strong>{selectedRoom.name}</strong>), {totalGuests} guests, and estimated total of <strong>₹{calcResult.totalEstimatedPrice.toLocaleString("en-IN")}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Re-open WhatsApp</span>
            </a>

            <button
              onClick={() => setSubmittedSuccess(null)}
              className="text-xs text-[#74796F] hover:text-[#26332A] underline py-2"
            >
              Modify Booking Details
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEnquireAndSend} className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E4DC] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C39A58]">
                Direct Host Confirmation
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#234B36]">
                Instant Stay Booking Enquiry
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#234B36]/10 text-[#234B36] text-[11px] font-bold uppercase tracking-wider self-start sm:self-auto">
              {calcResult.nights} Night{calcResult.nights > 1 ? "s" : ""} • {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1 & 2: DATES & GUESTS (1 COMPACT LINE) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                Step 1 &amp; 2: Stay Dates &amp; Guests
              </label>
              <span className="text-[10px] text-[#74796F]">Children under 6 free • 6-11 at 50%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-0.5">
                  Check-in Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#26332A] focus:outline-none"
                />
              </div>

              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-0.5">
                  Check-out Date
                </label>
                <input
                  type="date"
                  required
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#26332A] focus:outline-none"
                />
              </div>

              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-0.5">
                  Adults (12+ yrs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-transparent text-xs font-semibold text-[#26332A] focus:outline-none"
                />
              </div>

              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-0.5">
                  Children (&lt;12 yrs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-xs font-semibold text-[#26332A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: SELECT ROOM CATEGORY */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C39A58] mb-1.5">
              Step 3: Select Room Category (2 Categories)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Regular Pill */}
              <button
                type="button"
                onClick={() => setSelectedCategory("Regular")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedCategory === "Regular"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-sm"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C39A58]">
                    Arabica Variety
                  </span>
                  <span className="text-xs font-bold font-serif text-[#234B36]">
                    ₹{pricingConfig.Regular.startingPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#26332A] mt-0.5">
                  Regular Rooms
                </h4>
                <p className="text-[10px] text-[#74796F] mt-0.5">
                  Arabica 1 &amp; Arabica 2 • Starting at ₹1,500
                </p>
              </button>

              {/* Premium Pill */}
              <button
                type="button"
                onClick={() => setSelectedCategory("Premium")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedCategory === "Premium"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-sm"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C39A58]">
                    Robusta Variety
                  </span>
                  <span className="text-xs font-bold font-serif text-[#234B36]">
                    ₹{pricingConfig.Premium.startingPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#26332A] mt-0.5">
                  Premium Rooms
                </h4>
                <p className="text-[10px] text-[#74796F] mt-0.5">
                  Robusta Premium 1 &amp; 2 • Starting at ₹2,000
                </p>
              </button>
            </div>
          </div>

          {/* STEP 4: SELECT INDIVIDUAL ROOM */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C39A58] mb-1.5">
              Step 4: Select Individual Room in {selectedCategory} ({selectedRoom.variety} Variety)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {availableRoomsForCategory.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                        : "border-[#E5E4DC] hover:border-[#536B45] bg-[#FAF8F2]/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={room.coverImage} alt={room.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-xs text-[#26332A] truncate">{room.name}</p>
                      <p className="text-[10px] text-[#74796F] truncate">{room.capacity.bedConfiguration}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: SELECT PACKAGE */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C39A58] mb-1.5">
              Step 5: Select Package (Rates for {selectedCategory} - {selectedRoom.variety})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Stay Only */}
              <button
                type="button"
                onClick={() => setSelectedPackageType("stay-only")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedPackageType === "stay-only"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/50"
                }`}
              >
                <div>
                  <h5 className="font-serif font-bold text-sm text-[#26332A]">
                    Stay Only
                  </h5>
                  <p className="text-[10px] text-[#74796F] mt-0.5">
                    Room accommodation only • Meals not included
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="font-serif text-base font-bold text-[#234B36]">
                    ₹{categoryConfig.packages["stay-only"].pricePerPerson.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[9px] text-[#74796F]">/ guest / night</span>
                </div>
              </button>

              {/* Stay with Meals */}
              <button
                type="button"
                onClick={() => setSelectedPackageType("stay-with-meals")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedPackageType === "stay-with-meals"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/50"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-serif font-bold text-sm text-[#26332A]">
                      Stay + Meals
                    </h5>
                    <span className="px-1.5 py-0.2 bg-[#C39A58] text-[#234B36] text-[8px] font-extrabold uppercase rounded-full">
                      Popular
                    </span>
                  </div>
                  <p className="text-[10px] text-[#536B45] font-semibold mt-0.5">
                    Includes Malnad Breakfast &amp; Dinner
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="font-serif text-base font-bold text-[#234B36]">
                    ₹{categoryConfig.packages["stay-with-meals"].pricePerPerson.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[9px] text-[#74796F]">/ guest / night</span>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 6: DYNAMIC BOOKING SUMMARY CARD */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] space-y-2">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
              Step 6: Live Booking Summary &amp; Price Breakdown
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#74796F] block">Room &amp; Variety</span>
                <span className="font-bold text-[#26332A]">
                  {selectedRoom.name} ({selectedRoom.variety})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#74796F] block">Category &amp; Package</span>
                <span className="font-bold text-[#26332A]">
                  {selectedCategory} • {calcResult.packageName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#74796F] block">Stay Period</span>
                <span className="font-bold text-[#26332A]">
                  {calcResult.nights} Night{calcResult.nights > 1 ? "s" : ""} ({checkIn} to {checkOut})
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E4DC]/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <span className="text-[11px] text-[#74796F]">
                Formula: {calcResult.calculationBreakdown}
              </span>
              <div className="flex items-baseline space-x-1.5 self-end sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-[#74796F]">Estimated Total:</span>
                <span className="font-serif text-2xl font-extrabold text-[#234B36]">
                  ₹{calcResult.totalEstimatedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* OPTIONAL GUEST DETAILS (1 COMPACT LINE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="Your Full Name (optional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            />
            <input
              type="tel"
              placeholder="Your Mobile Number (optional)"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            />
          </div>

          {/* STEP 7: CONFIRM THROUGH WHATSAPP ENQUIRY */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E4DC]">
            <div className="text-left w-full sm:w-auto">
              <p className="text-[11px] text-[#74796F]">
                Step 7: Confirm availability with Host via pre-filled WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm &amp; Enquire on WhatsApp</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${businessConfig.phone}`}
                className="inline-flex items-center justify-center p-3.5 rounded-xl border border-[#234B36] text-[#234B36] hover:bg-[#234B36] hover:text-white transition-colors"
                title="Call Host directly"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
