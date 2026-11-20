import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import {
  BookedDateSlot,
  normalizeDateString,
  doesRoomMatch,
} from "../../services/availabilityService";

interface AvailabilityCalendarProps {
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onSelectDates: (checkIn: string, checkOut: string) => void;
  bookedSlots: BookedDateSlot[];
  onClose?: () => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  roomName,
  checkIn,
  checkOut,
  onSelectDates,
  bookedSlots,
  onClose,
}) => {
  // Current viewing month state
  const initialDate = checkIn ? new Date(checkIn) : new Date();
  const [viewDate, setViewDate] = useState<Date>(
    isNaN(initialDate.getTime()) ? new Date() : initialDate
  );

  // Selection step: 'pick-checkin' or 'pick-checkout'
  const [selectionStep, setSelectionStep] = useState<"pick-checkin" | "pick-checkout">("pick-checkin");
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const todayStr = normalizeDateString(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  // Filter booked slots for this room
  const roomBookings = bookedSlots.filter((slot) => doesRoomMatch(roomName, slot.roomName));

  // Helper: check if a specific date (YYYY-MM-DD) is booked (stay night)
  const isDateBooked = (dateStr: string): boolean => {
    for (const slot of roomBookings) {
      const slotStart = normalizeDateString(slot.checkIn);
      const slotEnd = normalizeDateString(slot.checkOut);
      // Stay night: checkIn <= date < checkOut
      if (dateStr >= slotStart && dateStr < slotEnd) {
        return true;
      }
    }
    return false;
  };

  // Helper: check if a range contains any booked date
  const rangeContainsBooked = (startStr: string, endStr: string): boolean => {
    let cur = new Date(startStr);
    const end = new Date(endStr);
    while (cur < end) {
      const curStr = normalizeDateString(cur);
      if (isDateBooked(curStr)) {
        return true;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  };

  // Handle date cell click (2-click range selection)
  const handleDateClick = (dateStr: string) => {
    setCalendarError(null);

    // Can't pick past or booked check-in date
    if (dateStr < todayStr) return;
    if (isDateBooked(dateStr)) {
      setCalendarError(`${dateStr} is already reserved. Please select an available open date.`);
      return;
    }

    // Step 1: Picking Check-in
    if (selectionStep === "pick-checkin" || !pendingStart) {
      setPendingStart(dateStr);
      setSelectionStep("pick-checkout");

      // Auto-set 1-night checkout as default preview
      const nextDay = new Date(dateStr);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = normalizeDateString(nextDay);
      if (!isDateBooked(dateStr)) {
        onSelectDates(dateStr, nextDayStr);
      }
      return;
    }

    // Step 2: Picking Check-out
    if (selectionStep === "pick-checkout" && pendingStart) {
      if (dateStr <= pendingStart) {
        // User clicked before start -> reset start to this clicked date
        setPendingStart(dateStr);
        setSelectionStep("pick-checkout");
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectDates(dateStr, normalizeDateString(nextDay));
        return;
      }

      // Check if range spans any booked days
      if (rangeContainsBooked(pendingStart, dateStr)) {
        setCalendarError("Selected date range includes days already reserved. Start date reset to clicked date.");
        setPendingStart(dateStr);
        setSelectionStep("pick-checkout");
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectDates(dateStr, normalizeDateString(nextDay));
        return;
      }

      // Valid range complete!
      onSelectDates(pendingStart, dateStr);
      setPendingStart(null);
      setSelectionStep("pick-checkin");
    }
  };

  // Build calendar matrix
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffDays = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000));

  return (
    <div className="bg-white rounded-2xl border-2 border-[#234B36]/30 p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Month & Step Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DC]">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-[#C39A58]" />
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#234B36]">
              {monthNames[month]} {year}
            </h4>
          </div>
          <span className="text-[10px] text-[#C39A58] font-bold uppercase tracking-wider block mt-0.5">
            {selectionStep === "pick-checkout"
              ? "👉 Step 2: Now tap your Check-out date"
              : "👉 Tap to select Check-in date, then Check-out"}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-[#E5E4DC] hover:bg-[#FAF8F2] text-[#26332A] transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-[#E5E4DC] hover:bg-[#FAF8F2] text-[#26332A] transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#FAF8F2] hover:bg-[#E5E4DC] text-[#74796F] hover:text-[#26332A] transition-colors ml-1"
              title="Close calendar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {calendarError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{calendarError}</span>
        </div>
      )}

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
          <span
            key={idx}
            className={`text-[10px] uppercase font-bold py-1 ${
              idx === 0 || idx === 6 ? "text-[#C39A58]" : "text-[#74796F]"
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((dayNum, index) => {
          if (dayNum === null) {
            return <div key={`empty-${index}`} className="h-9 sm:h-10" />;
          }

          const dayStr = String(dayNum).padStart(2, "0");
          const monthStr = String(month + 1).padStart(2, "0");
          const dateStr = `${year}-${monthStr}-${dayStr}`;

          const isPast = dateStr < todayStr;
          const isBooked = isDateBooked(dateStr);

          const isCheckIn = pendingStart ? dateStr === pendingStart : dateStr === checkIn;
          const isCheckOut = !pendingStart && dateStr === checkOut;
          const isInRange =
            !pendingStart && checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
          const isHoverRange =
            pendingStart && hoveredDate && dateStr > pendingStart && dateStr <= hoveredDate;

          // Styling logic
          let cellStyle = "bg-[#FAF8F2]/60 text-[#26332A] hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer";
          let labelText = "";

          if (isPast) {
            cellStyle = "bg-transparent text-gray-300 cursor-not-allowed line-through";
          } else if (isBooked) {
            // DIMMED / CROSSED OUT IN RED (FULL)
            cellStyle =
              "bg-rose-50 text-rose-400 line-through cursor-not-allowed border border-rose-200/60 font-medium";
            labelText = "Full";
          } else if (isCheckIn) {
            cellStyle = "bg-[#234B36] text-white font-bold shadow-sm ring-2 ring-[#C39A58]";
            labelText = "In";
          } else if (isCheckOut) {
            cellStyle = "bg-[#234B36] text-white font-bold shadow-sm ring-2 ring-[#C39A58]";
            labelText = "Out";
          } else if (isInRange || isHoverRange) {
            cellStyle = "bg-[#234B36]/15 text-[#234B36] font-semibold";
          }

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={isPast || isBooked}
              onClick={() => handleDateClick(dateStr)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative ${cellStyle}`}
              title={
                isBooked
                  ? `${dateStr}: Already Reserved / Booked`
                  : isPast
                  ? "Past date"
                  : `${dateStr}: Available`
              }
            >
              <span>{dayNum}</span>
              {labelText && (
                <span className="text-[7px] uppercase font-bold leading-none -mt-0.5 tracking-tight">
                  {labelText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Stay Summary & Apply Bar */}
      <div className="pt-3 border-t border-[#E5E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-xs">
          <span className="text-[10px] uppercase font-bold text-[#74796F] block">
            Selected Stay Duration
          </span>
          <span className="font-bold text-[#234B36] text-sm">
            {checkIn} &nbsp;➔&nbsp; {checkOut} &nbsp;({diffDays} Night{diffDays > 1 ? "s" : ""})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#234B36] hover:bg-[#1a3828] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#C39A58]" />
              <span>Apply Dates</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Legend */}
      <div className="pt-2 border-t border-[#E5E4DC]/60 flex flex-wrap items-center justify-between text-[11px] text-[#74796F] gap-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-white border border-[#E5E4DC]" />
          <span>Available</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-300 text-rose-400 flex items-center justify-center font-bold text-[8px] line-through">
            ×
          </span>
          <span className="text-rose-700 font-medium">Already Booked (Dimmed)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#234B36]" />
          <span className="text-[#234B36] font-medium">Your Selected Stay</span>
        </div>
      </div>
    </div>
  );
};
