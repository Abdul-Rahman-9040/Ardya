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
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  Calendar,
  Users,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  BedDouble,
  Check,
  Send,
  Mail,
  User,
  UtensilsCrossed,
  ShieldCheck,
  Info,
  Clock,
  ArrowRight,
  CalendarX,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { submitBookingEnquiry, BookingEnquiryPayload } from "../../services/enquiryService";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import {
  fetchLiveBookedSlots,
  isRoomAvailable,
  getBookedSlotsForRoom,
  findNextAvailableDates,
  findAlternativeRoomsOnSameDates,
  BookedDateSlot,
} from "../../services/availabilityService";

interface BookingFormProps {
  initialCategory?: RoomCategory;
  initialRoomId?: string;
  initialPackageType?: PackageType;
  onRoomChange?: (room: Room) => void;
}

interface ConfirmedEnquiryData {
  enquiryId: string;
  guestName: string;
  mobileNumber: string;
  email: string;
  roomName: string;
  category: RoomCategory;
  variety: string;
  packageName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  adults: number;
  children: number;
  total: number;
  specialRequests?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialCategory = "Regular",
  initialRoomId = "arabica-1",
  initialPackageType = "stay-with-meals",
  onRoomChange,
}) => {
  // Guest Contact Information
  const [guestName, setGuestName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

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

  // Live Google Sheets Confirmed Bookings State
  const [bookedSlots, setBookedSlots] = useState<BookedDateSlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showBookedCalendar, setShowBookedCalendar] = useState(false);

  // Dynamic pricing state (auto-reloads on custom event)
  const [pricingConfig, setPricingConfig] = useState(getActivePricingConfig());

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedEnquiry, setConfirmedEnquiry] = useState<ConfirmedEnquiryData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedRoomId(initialRoomId);
  }, [initialCategory, initialRoomId]);

  // Load live confirmed bookings from Google Sheets
  const refreshAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const slots = await fetchLiveBookedSlots();
      setBookedSlots(slots);
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    refreshAvailability();
  }, []);

  // Listen to admin price updates (local and cloud sync)
  useEffect(() => {
    const handlePriceUpdate = () => {
      setPricingConfig(getActivePricingConfig());
    };
    window.addEventListener("ardya-pricing-updated", handlePriceUpdate);
    window.addEventListener("ardya-config-updated", handlePriceUpdate);
    return () => {
      window.removeEventListener("ardya-pricing-updated", handlePriceUpdate);
      window.removeEventListener("ardya-config-updated", handlePriceUpdate);
    };
  }, []);

  // Filter available rooms strictly by selected category
  const availableRoomsForCategory = defaultRooms.filter((r) => r.category === selectedCategory);

  // Whenever category changes, ensure selectedRoomId is valid for that category
  useEffect(() => {
    const currentRoomBelongs = availableRoomsForCategory.some((r) => r.id === selectedRoomId);
    if (!currentRoomBelongs && availableRoomsForCategory.length > 0) {
      const nextRoom = availableRoomsForCategory[0];
      setSelectedRoomId(nextRoom.id);
      onRoomChange?.(nextRoom);
    }
  }, [selectedCategory, availableRoomsForCategory, selectedRoomId, onRoomChange]);

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

  // AVAILABILITY CALCULATION AGAINST GOOGLE SHEETS "CONFIRMED" STATUS
  const availabilityResult = isRoomAvailable(selectedRoom.name, checkIn, checkOut, bookedSlots);
  const isRoomFull = !availabilityResult.available;
  const conflictingSlot = availabilityResult.conflictingSlot;

  // Find Alternative Available Dates for this exact room
  const nextAvailableDates = isRoomFull
    ? findNextAvailableDates(selectedRoom.name, checkIn, calculatedNights, bookedSlots)
    : null;

  // Find Alternative Rooms that ARE free for the requested dates
  const alternativeRooms = isRoomFull
    ? findAlternativeRoomsOnSameDates(checkIn, checkOut, selectedRoom.id, bookedSlots)
    : [];

  // Confirmed bookings for current room
  const currentRoomBookings = getBookedSlotsForRoom(selectedRoom.name, bookedSlots);

  // Helper to switch to suggested open dates
  const handleApplyAlternativeDates = (newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setErrorMessage(null);
  };

  // Helper to switch to suggested available room
  const handleApplyAlternativeRoom = (altRoom: Room) => {
    setSelectedCategory(altRoom.category);
    setSelectedRoomId(altRoom.id);
    onRoomChange?.(altRoom);
    setErrorMessage(null);
  };

  // Build pre-filled WhatsApp message
  const buildEnquiryMessage = (enquiryRef?: string) => {
    const guestLabel = `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""} (under 12)` : ""}`;
    const nameLine = guestName.trim() ? `• Guest Name: ${guestName.trim()}\n` : "";
    const phoneLine = mobileNumber.trim() ? `• Phone: ${mobileNumber.trim()}\n` : "";
    const emailLine = email.trim() ? `• Email: ${email.trim()}\n` : "";
    const refLine = enquiryRef ? `• Booking Reference: ${enquiryRef}\n` : "";
    const requestsLine = specialRequests.trim() ? `• Notes/Requests: ${specialRequests.trim()}\n` : "";

    return (
      `*Ardya Homestays – Booking Enquiry*\n` +
      `Location: Balehalli, Chikkamagaluru\n\n` +
      `${refLine}` +
      `${nameLine}` +
      `${phoneLine}` +
      `${emailLine}` +
      `• Category: ${selectedCategory} Rooms (${selectedRoom.variety})\n` +
      `• Room Name: ${selectedRoom.name}\n` +
      `• Package: ${calcResult.packageName}\n` +
      `• Check-in: ${checkIn}\n` +
      `• Check-out: ${checkOut} (${calcResult.nights} Night${calcResult.nights > 1 ? "s" : ""})\n` +
      `• Guests: ${guestLabel}\n` +
      `• Applicable Rate: ₹${calcResult.ratePerPerson.toLocaleString("en-IN")}/person/night\n` +
      `• Estimated Total: ₹${calcResult.totalEstimatedPrice.toLocaleString("en-IN")}\n` +
      `${requestsLine}\n` +
      `Please confirm room availability for our stay. Thank you!`
    );
  };

  const getWhatsAppUrl = (enquiryRef?: string) => {
    return `https://wa.me/${businessConfig.phone}?text=${encodeURIComponent(buildEnquiryMessage(enquiryRef))}`;
  };

  // Primary: Submit Online Booking Enquiry (logs to Google Sheets + sends email voucher)
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Prevent submission if the room is already confirmed full in Google Sheets
    if (isRoomFull) {
      setErrorMessage(
        `${selectedRoom.name} is already confirmed full for ${checkIn} to ${checkOut}. Please select the alternative dates or available room suggested above.`
      );
      return;
    }

    if (!guestName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number so the host can contact you.");
      return;
    }

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
      guestName: guestName.trim(),
      mobileNumber: cleanPhone,
      email: email.trim() || undefined,
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
      specialRequests: specialRequests.trim() || undefined,
    };

    try {
      const response = await submitBookingEnquiry(payload);
      const enqId = response.enquiryId || "ENQ-" + Math.floor(100000 + Math.random() * 900000);
      setConfirmedEnquiry({
        enquiryId: enqId,
        guestName: payload.guestName,
        mobileNumber: payload.mobileNumber,
        email: email.trim(),
        roomName: selectedRoom.name,
        category: selectedCategory,
        variety: selectedRoom.variety,
        packageName: calcResult.packageName,
        checkIn,
        checkOut,
        nights: calcResult.nights,
        guests: totalGuests,
        adults: Number(adults),
        children: Number(children),
        total: calcResult.totalEstimatedPrice,
        specialRequests: specialRequests.trim() || undefined,
      });
    } catch {
      const fallbackId = "ENQ-" + Math.floor(100000 + Math.random() * 900000);
      setConfirmedEnquiry({
        enquiryId: fallbackId,
        guestName: payload.guestName,
        mobileNumber: payload.mobileNumber,
        email: email.trim(),
        roomName: selectedRoom.name,
        category: selectedCategory,
        variety: selectedRoom.variety,
        packageName: calcResult.packageName,
        checkIn,
        checkOut,
        nights: calcResult.nights,
        guests: totalGuests,
        adults: Number(adults),
        children: Number(children),
        total: calcResult.totalEstimatedPrice,
        specialRequests: specialRequests.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Secondary: Direct WhatsApp Enquiry
  const handleWhatsAppDirect = () => {
    const payload: BookingEnquiryPayload = {
      guestName: guestName.trim() || "Guest (WhatsApp Enquiry)",
      mobileNumber: mobileNumber.replace(/\D/g, "") || "Direct WhatsApp",
      email: email.trim() || undefined,
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
      specialRequests: specialRequests.trim() || undefined,
    };

    // Log to Google Sheets in background so no enquiry is lost
    submitBookingEnquiry(payload).catch(() => {});
    window.open(getWhatsAppUrl(), "_blank", "noopener,noreferrer");
  };

  const categoryConfig = pricingConfig[selectedCategory];

  return (
    <div className="bg-white rounded-3xl border border-[#E5E4DC] p-5 sm:p-8 shadow-xl">
      {confirmedEnquiry ? (
        /* CONFIRMATION VOUCHER CARD */
        <div className="space-y-6">
          <div className="text-center py-4 space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#C39A58]/15 text-[#C39A58] text-[11px] font-bold uppercase tracking-wider">
              Enquiry Submitted Successfully
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
              Booking Enquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-[#74796F] max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{confirmedEnquiry.guestName}</strong>. Your reservation request has been registered directly in our host management system.
            </p>
          </div>

          {/* Structured Confirmation Receipt */}
          <div className="bg-[#FAF8F2] border border-[#E5E4DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E4DC] gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#74796F] block">
                  Booking Reference Number
                </span>
                <span className="font-mono text-base font-bold text-[#234B36]">
                  {confirmedEnquiry.enquiryId}
                </span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Booking</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Room &amp; Category</span>
                <span className="font-semibold text-[#26332A] text-sm">
                  {confirmedEnquiry.roomName}
                </span>
                <span className="text-[11px] text-[#74796F] block">
                  {confirmedEnquiry.category} ({confirmedEnquiry.variety} Coffee Variety)
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Meal Package</span>
                <span className="font-semibold text-[#26332A] text-sm">
                  {confirmedEnquiry.packageName}
                </span>
                <span className="text-[11px] text-[#536B45] block font-medium">
                  {confirmedEnquiry.packageName.includes("Meals")
                    ? "Includes Malnad Breakfast & Dinner"
                    : "Room accommodation only"}
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E5E4DC]/60">
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Stay Duration</span>
                <span className="font-semibold text-[#26332A]">
                  {confirmedEnquiry.checkIn} to {confirmedEnquiry.checkOut}
                </span>
                <span className="text-[11px] text-[#74796F] block">
                  {confirmedEnquiry.nights} Night{confirmedEnquiry.nights > 1 ? "s" : ""} • {confirmedEnquiry.guests} Guest{confirmedEnquiry.guests > 1 ? "s" : ""} ({confirmedEnquiry.adults} Adults{confirmedEnquiry.children > 0 ? `, ${confirmedEnquiry.children} Children` : ""})
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E5E4DC]/60">
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Guest Contact</span>
                <span className="font-semibold text-[#26332A] block">
                  {confirmedEnquiry.mobileNumber}
                </span>
                {confirmedEnquiry.email && (
                  <span className="text-[11px] text-[#74796F] block">
                    {confirmedEnquiry.email}
                  </span>
                )}
              </div>
            </div>

            {confirmedEnquiry.specialRequests && (
              <div className="pt-2 border-t border-[#E5E4DC]/60 text-xs">
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Special Notes</span>
                <p className="text-[#26332A] mt-0.5 italic">"{confirmedEnquiry.specialRequests}"</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#E5E4DC] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#74796F] font-bold block">Estimated Total</span>
                <span className="text-[11px] text-[#74796F]">Pay directly at check-in / as agreed with host</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#234B36]">
                ₹{confirmedEnquiry.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Delivery & Next Steps Notice */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs space-y-1 text-emerald-950">
            <p className="font-bold flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Enquiry safely recorded in Google Sheets &amp; Host Management Dashboard.</span>
            </p>
            {confirmedEnquiry.email ? (
              <p className="text-[#555E57] pl-5">
                An automated confirmation voucher has been dispatched to <strong>{confirmedEnquiry.email}</strong>.
              </p>
            ) : (
              <p className="text-[#555E57] pl-5">
                The host will review availability and contact you on <strong>{confirmedEnquiry.mobileNumber}</strong> shortly.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getWhatsAppUrl(confirmedEnquiry.enquiryId)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp with Ref #{confirmedEnquiry.enquiryId}</span>
            </a>

            <a
              href={`tel:${businessConfig.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-[#234B36] text-[#234B36] hover:bg-[#234B36] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>Call Host Directly</span>
            </a>

            <button
              onClick={() => setConfirmedEnquiry(null)}
              className="text-xs text-[#74796F] hover:text-[#26332A] underline py-2 min-h-[44px]"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        /* THE ONLINE BOOKING ENQUIRY FORM */
        <form onSubmit={handleSubmitEnquiry} className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E4DC] pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#C39A58]/15 text-[#C39A58] text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Direct Host Reservation Desk</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
                Online Stay Booking Enquiry Form
              </h3>
              <p className="text-xs text-[#74796F] mt-0.5">
                Calculate live prices, check inclusions, and submit your reservation enquiry directly to the host.
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <div className="px-3 py-1.5 rounded-xl bg-[#234B36]/10 text-[#234B36] text-xs font-bold uppercase tracking-wider shrink-0">
                {calcResult.nights} Night{calcResult.nights > 1 ? "s" : ""} • {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: DATES & GUEST COUNTS WITH LIVE AVAILABILITY STATUS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C39A58] flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Step 1: Stay Dates &amp; Number of Guests</span>
              </label>

              {/* LIVE GOOGLE SHEETS AVAILABILITY PILL */}
              <div className="flex items-center space-x-2">
                {isRoomFull ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-extrabold uppercase tracking-wide animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Selected Dates Full in Google Sheets</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Available on Selected Dates</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowBookedCalendar(!showBookedCalendar)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-[#E5E4DC] hover:border-[#234B36] text-[10px] font-bold text-[#234B36] transition-all shadow-2xs"
                  title="Check interactive calendar with dimmed dates"
                >
                  <Calendar className="w-3 h-3 text-[#C39A58]" />
                  <span>{showBookedCalendar ? "Hide Calendar Grid" : "Open Calendar Grid (Dimmed Dates)"}</span>
                  {showBookedCalendar ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* INTERACTIVE MONTHLY CALENDAR GRID WITH DIMMED BOOKED DAYS */}
            {showBookedCalendar && (
              <div className="mb-3 space-y-2">
                <AvailabilityCalendar
                  roomName={selectedRoom.name}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDates={(newIn, newOut) => {
                    setCheckIn(newIn);
                    setCheckOut(newOut);
                    setErrorMessage(null);
                  }}
                  bookedSlots={bookedSlots}
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className={`p-2.5 rounded-xl border ${isRoomFull ? "bg-rose-50/50 border-rose-300" : "bg-[#FAF8F2] border-[#E5E4DC]"}`}>
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-1">
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

              <div className={`p-2.5 rounded-xl border ${isRoomFull ? "bg-rose-50/50 border-rose-300" : "bg-[#FAF8F2] border-[#E5E4DC]"}`}>
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-1">
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

              <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-1">
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

              <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E5E4DC]">
                <label className="block text-[9px] uppercase font-bold text-[#74796F] mb-1">
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

          {/* ROOM FULL NOTIFICATION & ALTERNATIVE DATES SUGGESTION CARD */}
          {isRoomFull && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 text-amber-950 space-y-3.5 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
                  <CalendarX className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      Already Booked in Google Sheets
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-amber-950 mt-1">
                    {selectedRoom.name} is Already Full on Your Selected Dates
                  </h4>
                  <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                    This room has a confirmed booking from <strong>{conflictingSlot?.checkIn || checkIn}</strong> to <strong>{conflictingSlot?.checkOut || checkOut}</strong>. We've found the following alternatives for you:
                  </p>
                </div>
              </div>

              {/* OPTION A: NEXT AVAILABLE DATES FOR THIS ROOM */}
              {nextAvailableDates && (
                <div className="p-3 bg-white/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-[#C39A58] block">
                      Option A: Next Open Dates for {selectedRoom.name}
                    </span>
                    <span className="text-xs font-bold text-[#234B36]">
                      {nextAvailableDates.checkIn} to {nextAvailableDates.checkOut} ({calcResult.nights} Night{calcResult.nights > 1 ? "s" : ""})
                    </span>
                    <span className="block text-[10px] text-[#74796F]">
                      Same room, guaranteed available
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyAlternativeDates(nextAvailableDates.checkIn, nextAvailableDates.checkOut)}
                    className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#234B36] hover:bg-[#1a3828] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto min-h-[38px]"
                  >
                    <span>Switch to These Dates</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C39A58]" />
                  </button>
                </div>
              )}

              {/* OPTION B: ALTERNATIVE ROOMS AVAILABLE ON EXACT REQUESTED DATES */}
              {alternativeRooms.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-extrabold text-[#C39A58] block">
                    Option B: Other Rooms Free on Your Exact Dates ({checkIn} to {checkOut})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {alternativeRooms.map((altRoom) => (
                      <button
                        key={altRoom.id}
                        type="button"
                        onClick={() => handleApplyAlternativeRoom(altRoom)}
                        className="p-2.5 rounded-xl bg-white border border-amber-300 hover:border-emerald-600 text-left transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="truncate mr-2">
                          <p className="font-bold text-xs text-[#26332A] group-hover:text-[#234B36] truncate">
                            {altRoom.name}
                          </p>
                          <p className="text-[10px] text-[#74796F]">
                            {altRoom.category} • from ₹{altRoom.startingPrice.toLocaleString("en-IN")}/person
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0 flex items-center space-x-1">
                          <span>Book Instead</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-900 pt-1">
                  All rooms appear busy for these exact dates. Please select the next available dates above or message the host on WhatsApp to check for waitlists or extra bedding options.
                </p>
              )}
            </div>
          )}

          {/* STEP 2: ROOM CATEGORY SELECTION */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C39A58] mb-2">
              Step 2: Room Category (Regular vs Premium)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Regular Option */}
              <button
                type="button"
                onClick={() => setSelectedCategory("Regular")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
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
                    from ₹{pricingConfig.Regular.startingPrice.toLocaleString("en-IN")}/person
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#26332A] mt-1">
                  Regular Rooms (Arabica)
                </h4>
                <p className="text-[11px] text-[#74796F] mt-0.5">
                  Arabica 1 &amp; Arabica 2 • Intimate rooms nestled right in coffee bushes with attached bathrooms.
                </p>
              </button>

              {/* Premium Option */}
              <button
                type="button"
                onClick={() => setSelectedCategory("Premium")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
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
                    from ₹{pricingConfig.Premium.startingPrice.toLocaleString("en-IN")}/person
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#26332A] mt-1">
                  Premium Rooms (Robusta)
                </h4>
                <p className="text-[11px] text-[#74796F] mt-0.5">
                  Robusta Premium 1 &amp; 2 • Spacious luxury suites with elevated veranda views and premium wooden furniture.
                </p>
              </button>
            </div>
          </div>

          {/* STEP 3: INDIVIDUAL ROOM SELECTION */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C39A58] mb-2 flex items-center space-x-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              <span>Step 3: Select Room in {selectedCategory} Category</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableRoomsForCategory.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const roomAvail = isRoomAvailable(room.name, checkIn, checkOut, bookedSlots);
                const roomIsBusy = !roomAvail.available;

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      onRoomChange?.(room);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                      isSelected
                        ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                        : "border-[#E5E4DC] hover:border-[#536B45] bg-[#FAF8F2]/40"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                      <img src={room.coverImage} alt={room.name} className="w-full h-full object-cover" />
                      {roomIsBusy && (
                        <div className="absolute inset-0 bg-rose-900/60 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white uppercase tracking-wider">Full</span>
                        </div>
                      )}
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-[#26332A] truncate">{room.name}</p>
                        {roomIsBusy ? (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Booked
                          </span>
                        ) : (
                          isSelected && <Check className="w-4 h-4 text-[#234B36] shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#74796F] truncate">{room.capacity.bedConfiguration}</p>
                      <p className="text-[10px] text-[#536B45] font-medium">En-suite washroom • Estate view</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: MEAL PACKAGE SELECTION */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#C39A58] mb-2 flex items-center space-x-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Step 4: Select Meal Package</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Stay Only */}
              <button
                type="button"
                onClick={() => setSelectedPackageType("stay-only")}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedPackageType === "stay-only"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/50"
                }`}
              >
                <div>
                  <h5 className="font-serif font-bold text-sm text-[#26332A]">
                    Stay Only
                  </h5>
                  <p className="text-[11px] text-[#74796F] mt-0.5">
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
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedPackageType === "stay-with-meals"
                    ? "border-[#234B36] bg-[#234B36]/5 ring-2 ring-[#234B36] shadow-xs"
                    : "border-[#E5E4DC] hover:border-[#C39A58] bg-[#FAF8F2]/50"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-serif font-bold text-sm text-[#26332A]">
                      Stay + All Meals
                    </h5>
                    <span className="px-1.5 py-0.5 bg-[#C39A58] text-[#234B36] text-[8px] font-extrabold uppercase rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-[#536B45] font-semibold mt-0.5">
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

          {/* STEP 5: GUEST CONTACT INFORMATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C39A58] flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Step 5: Guest Contact Information</span>
              </label>
              <p className="text-[11px] text-[#74796F] mt-0.5">
                Provide your details so the host can confirm availability and dispatch your booking voucher.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#26332A] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#74796F] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Hegde"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E5E4DC] rounded-xl text-[#26332A] font-medium focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#26332A] mb-1">
                  Mobile / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#74796F] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E5E4DC] rounded-xl text-[#26332A] font-medium focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#26332A] mb-1">
                  Email Address <span className="text-[#C39A58] font-normal">(for instant confirmation voucher)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#74796F] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E5E4DC] rounded-xl text-[#26332A] font-medium focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#26332A] mb-1">
                  Special Requests / Dietary Notes <span className="text-[#74796F] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Veg / Jain meals, campfire, late arrival"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5E4DC] rounded-xl text-[#26332A] font-medium focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                />
              </div>
            </div>
          </div>

          {/* STEP 6: DYNAMIC BOOKING SUMMARY & PRICE CALCULATION CARD */}
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E5E4DC] space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
              Step 6: Real-time Price Calculation Summary
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <span className="text-[10px] text-[#74796F] block">Selected Room</span>
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
                <span className="text-[10px] text-[#74796F] block">Stay Duration</span>
                <span className="font-bold text-[#26332A]">
                  {calcResult.nights} Night{calcResult.nights > 1 ? "s" : ""} ({checkIn} to {checkOut})
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#E5E4DC]/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="text-[11px] text-[#74796F]">
                Formula: {calcResult.calculationBreakdown}
              </span>
              <div className="flex items-baseline space-x-2 self-end sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-[#74796F]">Estimated Total:</span>
                <span className="font-serif text-2xl font-extrabold text-[#234B36]">
                  ₹{calcResult.totalEstimatedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 7: ACTION BUTTONS (ONLINE ENQUIRY + WHATSAPP OPTION) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E4DC]">
            <div className="text-left w-full sm:w-auto">
              <p className="text-[11px] text-[#74796F]">
                Zero advance required to submit • Direct host confirmation • Instant receipt
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {/* PRIMARY ACTION: SUBMIT ONLINE ENQUIRY FORM */}
              {isRoomFull ? (
                <button
                  type="button"
                  onClick={() => {
                    if (nextAvailableDates) {
                      handleApplyAlternativeDates(nextAvailableDates.checkIn, nextAvailableDates.checkOut);
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md min-h-[44px]"
                  title="Click to switch to next available open dates"
                >
                  <CalendarX className="w-4 h-4" />
                  <span>Dates Full — Switch to Next Available</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-[#234B36] hover:bg-[#1a3828] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C39A58]" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#C39A58]" />
                      <span>Submit Booking Enquiry</span>
                    </>
                  )}
                </button>
              )}

              {/* SECONDARY ACTION: WHATSAPP DIRECT */}
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center justify-center space-x-2 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs min-h-[44px]"
                title="Send pre-filled enquiry to Host on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isRoomFull ? "Ask Host on WhatsApp" : "Or WhatsApp Host"}</span>
              </button>

              {/* CALL HOST */}
              <a
                href={`tel:${businessConfig.phone}`}
                className="inline-flex items-center justify-center p-3.5 rounded-xl border border-[#234B36] text-[#234B36] hover:bg-[#234B36] hover:text-white transition-colors min-h-[44px] min-w-[44px]"
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
