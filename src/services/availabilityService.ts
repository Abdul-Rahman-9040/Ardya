import { defaultRooms, Room } from "../data/rooms";
import { getAppsScriptUrl } from "./enquiryService";

export interface BookedDateSlot {
  enquiryId?: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status: string;
}

export function normalizeDateString(dateVal: any): string {
  if (!dateVal) return "";
  if (typeof dateVal === "string") {
    const trimmed = dateVal.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function doesRoomMatch(roomQuery: string, bookedRoomName: string): boolean {
  if (!roomQuery || !bookedRoomName) return false;
  const q = roomQuery.toLowerCase().replace(/[^a-z0-9]/g, "");
  const b = bookedRoomName.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (q === b || q.includes(b) || b.includes(q)) return true;

  // Specific Arabica / Robusta room numbers
  if (q.includes("arabica1") && b.includes("arabica1")) return true;
  if (q.includes("arabica2") && b.includes("arabica2")) return true;
  if (q.includes("robusta1") && b.includes("robusta1")) return true;
  if (q.includes("robusta2") && b.includes("robusta2")) return true;

  return false;
}

// Check if two date ranges overlap (assuming check-out morning and check-in afternoon)
export function areDatesOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const normStartA = normalizeDateString(startA);
  const normEndA = normalizeDateString(endA);
  const normStartB = normalizeDateString(startB);
  const normEndB = normalizeDateString(endB);

  if (!normStartA || !normEndA || !normStartB || !normEndB) return false;

  // Standard hotel interval overlap: [startA, endA) intersects [startB, endB)
  return normStartA < normEndB && normEndA > normStartB;
}

// Fetch confirmed bookings from Google Sheets (via Google Apps Script Web App)
export async function fetchLiveBookedSlots(): Promise<BookedDateSlot[]> {
  const scriptUrl = getAppsScriptUrl();
  const slots: BookedDateSlot[] = [];

  // 1. Fetch from live Google Sheets if endpoint configured
  if (scriptUrl) {
    try {
      // First try dedicated privacy-safe booked dates endpoint
      let response = await fetch(`${scriptUrl}?action=getBookedDates&_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.bookedSlots)) {
          data.bookedSlots.forEach((slot: any) => {
            if (String(slot.status).toLowerCase() === "confirmed") {
              slots.push({
                enquiryId: slot.enquiryId,
                roomName: slot.roomName || "",
                checkIn: normalizeDateString(slot.checkIn),
                checkOut: normalizeDateString(slot.checkOut),
                status: "Confirmed",
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch booked slots via getBookedDates:", e);
    }

    // Fallback: If getBookedDates returned nothing, try getEnquiries endpoint
    if (slots.length === 0) {
      try {
        const response = await fetch(`${scriptUrl}?action=getEnquiries&_t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.enquiries)) {
            data.enquiries.forEach((enq: any) => {
              if (String(enq.status).toLowerCase() === "confirmed") {
                slots.push({
                  enquiryId: enq.enquiryId,
                  roomName: enq.roomName || "",
                  checkIn: normalizeDateString(enq.checkIn),
                  checkOut: normalizeDateString(enq.checkOut),
                  status: "Confirmed",
                });
              }
            });
          }
        }
      } catch (e) {
        console.warn("Could not fetch enquiries for availability:", e);
      }
    }
  }

  // 2. Merge local storage backup (for offline admin testing)
  try {
    const local = JSON.parse(localStorage.getItem("ardya_enquiries") || "[]");
    if (Array.isArray(local)) {
      local.forEach((enq: any) => {
        if (String(enq.status).toLowerCase() === "confirmed") {
          const exists = slots.some(
            (s) => s.enquiryId && s.enquiryId === enq.enquiryId
          );
          if (!exists) {
            slots.push({
              enquiryId: enq.enquiryId,
              roomName: enq.roomName || "",
              checkIn: normalizeDateString(enq.checkIn),
              checkOut: normalizeDateString(enq.checkOut),
              status: "Confirmed",
            });
          }
        }
      });
    }
  } catch {}

  return slots;
}

// Check if a specific room is available for given dates
export function isRoomAvailable(
  roomQuery: string,
  checkIn: string,
  checkOut: string,
  bookedSlots: BookedDateSlot[]
): { available: boolean; conflictingSlot?: BookedDateSlot } {
  for (const slot of bookedSlots) {
    if (doesRoomMatch(roomQuery, slot.roomName)) {
      if (areDatesOverlapping(checkIn, checkOut, slot.checkIn, slot.checkOut)) {
        return { available: false, conflictingSlot: slot };
      }
    }
  }
  return { available: true };
}

// Find all confirmed booked slots for a given room
export function getBookedSlotsForRoom(
  roomQuery: string,
  bookedSlots: BookedDateSlot[]
): BookedDateSlot[] {
  return bookedSlots
    .filter((slot) => doesRoomMatch(roomQuery, slot.roomName))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

// Find the next available date range for this exact room (preserving requested duration)
export function findNextAvailableDates(
  roomQuery: string,
  requestedCheckIn: string,
  requestedNights: number,
  bookedSlots: BookedDateSlot[]
): { checkIn: string; checkOut: string } | null {
  const roomSlots = getBookedSlotsForRoom(roomQuery, bookedSlots);
  if (roomSlots.length === 0) return null;

  const nights = Math.max(1, requestedNights);
  const msPerDay = 86400000;
  let testDate = new Date(requestedCheckIn);

  // If requested check-in is in the past, start from tomorrow
  const tomorrow = new Date(Date.now() + msPerDay);
  if (testDate < tomorrow) {
    testDate = tomorrow;
  }

  // Scan up to 45 days forward for the earliest open gap
  for (let dayOffset = 1; dayOffset <= 45; dayOffset++) {
    const candidateStart = new Date(testDate.getTime() + dayOffset * msPerDay);
    const candidateEnd = new Date(candidateStart.getTime() + nights * msPerDay);

    const startStr = normalizeDateString(candidateStart);
    const endStr = normalizeDateString(candidateEnd);

    const check = isRoomAvailable(roomQuery, startStr, endStr, bookedSlots);
    if (check.available) {
      return { checkIn: startStr, checkOut: endStr };
    }
  }

  return null;
}

// Find alternative rooms in the homestay that ARE free on the requested dates
export function findAlternativeRoomsOnSameDates(
  checkIn: string,
  checkOut: string,
  currentRoomId: string,
  bookedSlots: BookedDateSlot[]
): Room[] {
  return defaultRooms.filter((room) => {
    if (room.id === currentRoomId) return false;
    const check = isRoomAvailable(room.name, checkIn, checkOut, bookedSlots);
    return check.available;
  });
}
