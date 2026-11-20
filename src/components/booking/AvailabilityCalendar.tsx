import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
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
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  roomName,
  checkIn,
  checkOut,
  onSelectDates,
  bookedSlots,
}) => {
  // Current viewing month state
  const initialDate = checkIn ? new Date(checkIn) : new Date();
  const [viewDate, setViewDate] = useState<Date>(
    isNaN(initialDate.getTime()) ? new Date() : initialDate
  );

  // Temporary selection state during clicking
  const [pendingCheckIn, setPendingCheckIn] = useState<string | null>(checkIn || null);
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

  // Handle date cell click
  const handleDateClick = (dateStr: string) => {
    setCalendarError(null);

    // Can't pick past or booked check-in date
    if (dateStr < todayStr) return;
    if (isDateBooked(dateStr)) {
      setCalendarError(`${dateStr} is already booked in Google Sheets. Please pick an open date.`);
      return;
    }

    // If starting fresh or both check-in & check-out were already picked
    if (!pendingCheckIn || (pendingCheckIn && checkOut && pendingCheckIn === checkIn)) {
      setPendingCheckIn(dateStr);
      // Auto-set 1-night checkout if available
      const nextDay = new Date(dateStr);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = normalizeDateString(nextDay);

      if (!isDateBooked(dateStr)) {
        onSelectDates(dateStr, nextDayStr);
      }
      return;
    }

    // If selecting check-out (second click)
    if (pendingCheckIn) {
      if (dateStr <= pendingCheckIn) {
        // Clicked on or before check-in -> treat as new check-in
        setPendingCheckIn(dateStr);
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectDates(dateStr, normalizeDateString(nextDay));
        return;
      }

      // Check if range spans any booked days
      if (rangeContainsBooked(pendingCheckIn, dateStr)) {
        setCalendarError("Selected date range includes days already booked in Google Sheets. Check-in reset to clicked date.");
        setPendingCheckIn(dateStr);
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectDates(dateStr, normalizeDateString(nextDay));
        return;
      }

      // Valid range! Apply
      onSelectDates(pendingCheckIn, dateStr);
      setPendingCheckIn(null);
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

  return (
    <div className="bg-white rounded-2xl border border-[#E5E4DC] p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Month Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DC]">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-[#C39A58]" />
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#234B36]">
            {monthNames[month]} {year}
          </h4>
          <span className="text-[10px] text-[#74796F] hidden sm:inline">
            • Tap date to set Check-in &amp; Check-out
          </span>
        </div>

        <div className="flex items-center space-x-1">
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
          const isCheckIn = dateStr === checkIn;
          const isCheckOut = dateStr === checkOut;
          const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

          // Styling logic
          let cellStyle = "bg-[#FAF8F2]/60 text-[#26332A] hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer";
          let labelText = "";

          if (isPast) {
            cellStyle = "bg-transparent text-gray-300 cursor-not-allowed line-through";
          } else if (isBooked) {
            // DIMMED / CROSSED OUT IN RED (FULL IN GOOGLE SHEETS)
            cellStyle =
              "bg-rose-50 text-rose-400 line-through cursor-not-allowed border border-rose-200/60 font-medium";
            labelText = "Full";
          } else if (isCheckIn) {
            cellStyle = "bg-[#234B36] text-white font-bold shadow-sm ring-2 ring-[#C39A58]";
            labelText = "In";
          } else if (isCheckOut) {
            cellStyle = "bg-[#234B36] text-white font-bold shadow-sm ring-2 ring-[#C39A58]";
            labelText = "Out";
          } else if (isInRange) {
            cellStyle = "bg-[#234B36]/15 text-[#234B36] font-semibold";
          }

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={isPast || isBooked}
              onClick={() => handleDateClick(dateStr)}
              className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative ${cellStyle}`}
              title={
                isBooked
                  ? `${dateStr}: Confirmed Booked in Google Sheets`
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

      {/* Visual Legend */}
      <div className="pt-2 border-t border-[#E5E4DC] flex flex-wrap items-center justify-between text-[11px] text-[#74796F] gap-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-white border border-[#E5E4DC]" />
          <span>Available</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-300 text-rose-400 flex items-center justify-center font-bold text-[8px] line-through">
            ×
          </span>
          <span className="text-rose-700 font-medium">Booked / Dimmed (Sheets)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#234B36]" />
          <span className="text-[#234B36] font-medium">Selected Stay</span>
        </div>
      </div>
    </div>
  );
};
