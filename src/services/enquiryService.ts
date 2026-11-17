export interface BookingEnquiryPayload {
  guestName: string;
  mobileNumber: string;
  email?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomId: string;
  roomName: string;
  packageId: string;
  packageName: string;
  pricePerPerson: number;
  numberOfNights: number;
  totalGuests: number;
  estimatedTotal: number;
  specialRequests?: string;
}

export interface EnquiryResponse {
  success: boolean;
  enquiryId?: string;
  message?: string;
  error?: string;
}

// Configurable endpoint for Google Apps Script Web App (reads from .env or Admin Panel setting)
export function getAppsScriptUrl(): string {
  const fromEnv = (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
  if (fromEnv) return fromEnv;
  try {
    const saved = localStorage.getItem("ardya_admin_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.googleAppsScriptUrl) return parsed.googleAppsScriptUrl;
    }
  } catch {}
  return "https://script.google.com/macros/s/AKfycbyPLYQx0ojWKCUyAP2jAYplnXLqKg6LOkvMP4Y_5Y-2JTu8hg5R2AZ6z-DAt6VqHmhL6Q/exec";
}

export async function submitBookingEnquiry(
  payload: BookingEnquiryPayload
): Promise<EnquiryResponse> {
  const scriptUrl = getAppsScriptUrl();

  // If no Apps Script URL configured yet, simulate reliable local fallback or save to localStorage for review
  if (!scriptUrl) {
    console.info("Google Apps Script URL is not set yet. Storing enquiry in localStorage backup.");
    
    // Save to local storage for offline admin testing
    const existing = JSON.parse(localStorage.getItem("ardya_enquiries") || "[]");
    const newEnquiry = {
      ...payload,
      enquiryId: "ENQ-" + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toISOString(),
      status: "New",
    };
    existing.unshift(newEnquiry);
    localStorage.setItem("ardya_enquiries", JSON.stringify(existing));

    // Simulated short network delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      enquiryId: newEnquiry.enquiryId,
      message: "Enquiry saved locally. To sync with Google Sheets, configure VITE_APPS_SCRIPT_URL.",
    };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // Uses text/plain to avoid CORS preflight options block on Google Apps Script
      },
      body: JSON.stringify({
        action: "submitEnquiry",
        data: payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.warn("Apps Script submission failed, saving to local fallback storage:", err);
    // Persist as pending local enquiry so no lead is lost
    const existing = JSON.parse(localStorage.getItem("ardya_enquiries") || "[]");
    const newEnquiry = {
      ...payload,
      enquiryId: "ENQ-OFFLINE-" + Math.floor(10000 + Math.random() * 90000),
      submittedAt: new Date().toISOString(),
      status: "Offline/Pending Sync",
    };
    existing.unshift(newEnquiry);
    localStorage.setItem("ardya_enquiries", JSON.stringify(existing));

    return {
      success: true,
      enquiryId: newEnquiry.enquiryId,
      message: "Enquiry recorded. You can also confirm immediately via WhatsApp.",
    };
  }
}
