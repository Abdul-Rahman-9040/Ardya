/**
 * Google Apps Script for Ardya Homestays
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new Spreadsheet named "Ardya Homestays Data".
 * 2. Rename the first sheet to "Enquiries".
 * 3. Add header row in sheet "Enquiries":
 *    A1: Enquiry ID | B1: Submitted At | C1: Guest Name | D1: Mobile Number | E1: Email | 
 *    F1: Check-in | G1: Check-out | H1: Adults | I1: Children | J1: Room | 
 *    K1: Package | L1: Price Per Person | M1: Number Of Nights | N1: Total Guests | 
 *    O1: Estimated Total | P1: Special Requests | Q1: Enquiry Status
 * 4. In Google Sheets, click Extensions > Apps Script.
 * 5. Replace Code.gs with this script content.
 * 6. Click Deploy > New deployment > Select type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL and add it to your .env file as:
 *    VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawBody = e.postData.contents;
    var requestData = JSON.parse(rawBody);

    if (requestData.action === "submitEnquiry") {
      return handleEnquirySubmission(requestData.data);
    }

    return responseJSON({ success: false, error: "Unknown action" });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function handleEnquirySubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  
  if (!sheet) {
    sheet = ss.insertSheet("Enquiries");
    sheet.appendRow([
      "Enquiry ID", "Submitted At", "Guest Name", "Mobile Number", "Email",
      "Check-in", "Check-out", "Adults", "Children", "Room",
      "Package", "Price Per Person", "Number Of Nights", "Total Guests",
      "Estimated Total", "Special Requests", "Status"
    ]);
  }

  // Recalculate trusted totals on server side
  var pricePerPerson = Number(data.pricePerPerson) || 1500;
  var totalGuests = Math.max(1, (Number(data.adults) || 1) + (Number(data.children) || 0));
  var nights = Math.max(1, Number(data.numberOfNights) || 1);
  var verifiedTotal = pricePerPerson * totalGuests * nights;

  var enquiryId = "ENQ-" + Utilities.formatDate(new Date(), "GMT+5:30", "yyyyMMdd-HHmmss");
  var timestamp = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");

  sheet.appendRow([
    enquiryId,
    timestamp,
    data.guestName || "",
    "'" + (data.mobileNumber || ""),
    data.email || "",
    data.checkIn || "",
    data.checkOut || "",
    data.adults || 1,
    data.children || 0,
    data.roomName || data.roomId || "",
    data.packageName || data.packageId || "",
    pricePerPerson,
    nights,
    totalGuests,
    verifiedTotal,
    data.specialRequests || "",
    "New"
  ]);

  return responseJSON({
    success: true,
    enquiryId: enquiryId,
    message: "Enquiry successfully recorded in Google Sheets"
  });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return responseJSON({
    status: "online",
    business: "Ardya Homestays",
    message: "Ardya Homestays Apps Script Web App is active."
  });
}
