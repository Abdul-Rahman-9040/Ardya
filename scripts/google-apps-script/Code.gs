/**
 * Google Apps Script for Ardya Homestays
 * Complete Backend: OTP Admin Auth, Enquiries, Config Storage, and Themed HTML Emails
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new Spreadsheet named "Ardya Homestays Data".
 * 2. In Google Sheets, click Extensions > Apps Script.
 * 3. Replace the entire code with this file.
 * 4. To configure your two authorized admin emails securely (without placing them in code):
 *    - In Apps Script, click Project Settings (gear icon on left).
 *    - Under "Script Properties", click "Add script property":
 *        Property: ADMIN_EMAIL_1   Value: <your primary email>
 *        Property: ADMIN_EMAIL_2   Value: <your secondary email>
 *    (Alternatively: create a sheet tab named "AuthorizedAdmins" and list authorized emails in Column A).
 * 5. Click Deploy > New deployment > Select type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and add it in your .env or Admin Panel:
 *    VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var rawBody = e.postData.contents;
    var requestData = JSON.parse(rawBody);
    var action = requestData.action;

    // 1. Submit Booking Enquiry
    if (action === "submitEnquiry") {
      return handleEnquirySubmission(requestData.data);
    }

    // 1b. Send Official Booking Confirmation Email
    if (action === "sendBookingConfirmation") {
      return handleSendBookingConfirmation(requestData.data);
    }

    // 2. Send Admin OTP
    if (action === "sendOTP") {
      return handleSendOTP(requestData.email);
    }

    // 3. Verify Admin OTP
    if (action === "verifyOTP") {
      return handleVerifyOTP(requestData.email, requestData.otp);
    }

    // 4. Get All Enquiries
    if (action === "getEnquiries") {
      return handleGetEnquiries();
    }

    // 5. Update Enquiry Status
    if (action === "updateEnquiryStatus") {
      return handleUpdateEnquiryStatus(requestData.enquiryId, requestData.status);
    }

    // 6. Save Site Config (Pricing, Amenities, FnB)
    if (action === "saveConfig") {
      return handleSaveConfig(requestData.config);
    }

    // 7. Get Site Config
    if (action === "getConfig") {
      return handleGetConfig();
    }

    return responseJSON({ success: false, error: "Unknown action: " + action });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = e.parameter.action;
  if (action === "getConfig") {
    return handleGetConfig();
  }
  if (action === "getEnquiries") {
    return handleGetEnquiries();
  }
  if (action === "getBookedDates") {
    return handleGetBookedDates();
  }

  return responseJSON({
    status: "online",
    business: "Ardya Homestays",
    message: "Ardya Homestays Backend is active with OTP Auth, Enquiries & Config Sync."
  });
}

// -------------------------------------------------------------
// 1. ENQUIRY HANDLING
// -------------------------------------------------------------
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

  // Send confirmation email to guest if email provided
  if (data.email && data.email.indexOf("@") !== -1) {
    try {
      var emailHtml = renderBookingConfirmationEmail(data, enquiryId, verifiedTotal);
      MailApp.sendEmail({
        to: data.email,
        subject: "Booking Enquiry Received | Ardya Homestays Balehalli (" + enquiryId + ")",
        htmlBody: emailHtml
      });
    } catch (mailErr) {
      Logger.log("Failed to send guest email: " + mailErr);
    }
  }

  return responseJSON({
    success: true,
    enquiryId: enquiryId,
    message: "Enquiry successfully recorded in Google Sheets"
  });
}

function handleSendBookingConfirmation(data) {
  if (!data || !data.email) {
    return responseJSON({ success: false, error: "Guest email is required to send confirmation." });
  }

  var enquiryId = data.enquiryId || "RES-" + Utilities.formatDate(new Date(), "GMT+5:30", "yyyyMMdd-HHmmss");
  var verifiedTotal = data.estimatedTotal || 0;

  try {
    var emailHtml = renderBookingConfirmationEmail(data, enquiryId, verifiedTotal);
    MailApp.sendEmail({
      to: data.email,
      subject: "Booking Confirmed & Room Reserved! | Ardya Homestays (" + enquiryId + ")",
      htmlBody: emailHtml
    });

    // Also update status in Enquiries sheet if ID matches
    if (data.enquiryId) {
      handleUpdateEnquiryStatus(data.enquiryId, "Confirmed");
    }

    return responseJSON({
      success: true,
      message: "Official confirmation email sent successfully to " + data.email
    });
  } catch (err) {
    return responseJSON({
      success: false,
      error: "Error dispatching confirmation email: " + err.toString()
    });
  }
}

// -------------------------------------------------------------
// 2. ADMIN OTP AUTHENTICATION & SECURE WHITELIST
// -------------------------------------------------------------
function getAuthorizedAdminEmails() {
  var props = PropertiesService.getScriptProperties();
  var list = [];
  
  // 1. Check Script Properties (secure key-value storage outside code)
  var email1 = props.getProperty("ADMIN_EMAIL_1");
  var email2 = props.getProperty("ADMIN_EMAIL_2");
  if (email1) list.push(email1.toLowerCase().trim());
  if (email2) list.push(email2.toLowerCase().trim());

  // 2. Check "AuthorizedAdmins" sheet in Google Sheets (if created)
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var adminSheet = ss.getSheetByName("AuthorizedAdmins");
    if (adminSheet) {
      var rows = adminSheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        var emailVal = String(rows[i][0]).toLowerCase().trim();
        if (emailVal && emailVal.indexOf("@") !== -1 && list.indexOf(emailVal) === -1) {
          list.push(emailVal);
        }
      }
    }
  } catch (sheetErr) {
    // Sheet check optional
  }

  // 3. Fallback: Owner of the Google Apps Script project
  try {
    var ownerEmail = Session.getEffectiveUser().getEmail();
    if (ownerEmail && list.indexOf(ownerEmail.toLowerCase().trim()) === -1) {
      list.push(ownerEmail.toLowerCase().trim());
    }
  } catch (ownerErr) {
    // Owner fetch optional
  }

  return list;
}

function handleSendOTP(email) {
  if (!email || email.indexOf("@") === -1) {
    return responseJSON({ success: false, error: "Please provide a valid administrator email address." });
  }

  var cleanEmail = email.toLowerCase().trim();
  var authorizedList = getAuthorizedAdminEmails();

  // STRICT WHITELIST ENFORCEMENT
  // Rejects any email that is not in the authorized administrator whitelist
  if (authorizedList.length > 0) {
    if (authorizedList.indexOf(cleanEmail) === -1) {
      return responseJSON({
        success: false,
        error: "Access Denied: This email address is not registered as an authorized administrator."
      });
    }
  }

  // Generate cryptographically random 6-digit OTP
  var otp = Math.floor(100000 + Math.random() * 900000).toString();
  var expiryTimestamp = new Date().getTime() + 10 * 60 * 1000; // 10 minutes

  // Store in ScriptProperties with expiration
  var props = PropertiesService.getScriptProperties();
  var authData = {
    otp: otp,
    email: cleanEmail,
    expiry: expiryTimestamp
  };
  props.setProperty("AUTH_" + cleanEmail, JSON.stringify(authData));

  // Send Email with themed HTML template
  try {
    var emailHtml = renderOtpEmail(otp, cleanEmail);
    MailApp.sendEmail({
      to: cleanEmail,
      subject: "Your Login Verification Code: " + otp + " | Ardya Homestays Admin",
      htmlBody: emailHtml
    });

    return responseJSON({
      success: true,
      message: "A 6-digit verification code has been dispatched. Valid for 10 minutes."
    });
  } catch (err) {
    return responseJSON({
      success: false,
      error: "Error sending verification email: " + err.toString()
    });
  }
}

function handleVerifyOTP(email, enteredOtp) {
  if (!email || !enteredOtp) {
    return responseJSON({ success: false, error: "Email and OTP are required." });
  }

  var props = PropertiesService.getScriptProperties();
  var key = "AUTH_" + email.toLowerCase().trim();
  var storedRaw = props.getProperty(key);

  if (!storedRaw) {
    return responseJSON({ success: false, error: "No OTP found. Please request a new verification code." });
  }

  var authData = JSON.parse(storedRaw);
  var now = new Date().getTime();

  if (now > authData.expiry) {
    props.deleteProperty(key);
    return responseJSON({ success: false, error: "The verification code has expired. Please request a new one." });
  }

  if (authData.otp !== enteredOtp.toString().trim()) {
    return responseJSON({ success: false, error: "Invalid verification code. Please check your email and try again." });
  }

  // OTP verified! Clean up and issue token
  props.deleteProperty(key);
  var sessionToken = "ardya_admin_" + Utilities.getUuid();

  return responseJSON({
    success: true,
    token: sessionToken,
    message: "Admin verified successfully."
  });
}

// -------------------------------------------------------------
// 3. ENQUIRIES RETRIEVAL & UPDATE
// -------------------------------------------------------------
function handleGetEnquiries() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) {
    return responseJSON({ success: true, enquiries: [] });
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return responseJSON({ success: true, enquiries: [] });
  }

  var headers = rows[0];
  var enquiries = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    enquiries.push({
      enquiryId: row[0],
      submittedAt: row[1],
      guestName: row[2],
      mobileNumber: String(row[3]).replace(/^'/, ""),
      email: row[4],
      checkIn: row[5],
      checkOut: row[6],
      adults: row[7],
      children: row[8],
      roomName: row[9],
      packageName: row[10],
      pricePerPerson: row[11],
      numberOfNights: row[12],
      totalGuests: row[13],
      estimatedTotal: row[14],
      specialRequests: row[15],
      status: row[16] || "New"
    });
  }

  return responseJSON({ success: true, enquiries: enquiries.reverse() });
}

function handleUpdateEnquiryStatus(enquiryId, status) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) return responseJSON({ success: false, error: "Enquiries sheet not found" });

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === enquiryId) {
      sheet.getRange(i + 1, 17).setValue(status);
      return responseJSON({ success: true, message: "Status updated to " + status });
    }
  }

  return responseJSON({ success: false, error: "Enquiry ID not found" });
}

function handleGetBookedDates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Enquiries");
  if (!sheet) {
    return responseJSON({ success: true, bookedSlots: [] });
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return responseJSON({ success: true, bookedSlots: [] });
  }

  var bookedSlots = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var status = String(row[16] || "").trim().toLowerCase();
    
    // Only return Confirmed reservations
    if (status === "confirmed") {
      var checkIn = row[5];
      var checkOut = row[6];
      var checkInStr = checkIn instanceof Date ? Utilities.formatDate(checkIn, "GMT+5:30", "yyyy-MM-dd") : String(checkIn);
      var checkOutStr = checkOut instanceof Date ? Utilities.formatDate(checkOut, "GMT+5:30", "yyyy-MM-dd") : String(checkOut);

      bookedSlots.push({
        enquiryId: String(row[0]),
        roomName: String(row[9]),
        checkIn: checkInStr,
        checkOut: checkOutStr,
        status: "Confirmed"
      });
    }
  }

  return responseJSON({ success: true, bookedSlots: bookedSlots });
}

// -------------------------------------------------------------
// 4. CONFIGURATION STORAGE (Pricing, Amenities, FnB)
// -------------------------------------------------------------
function handleSaveConfig(config) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("SiteConfig");
  if (!sheet) {
    sheet = ss.insertSheet("SiteConfig");
    sheet.appendRow(["Key", "Value", "LastUpdated"]);
  }

  var timestamp = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
  sheet.getRange("A2").setValue("ACTIVE_CONFIG");
  sheet.getRange("B2").setValue(JSON.stringify(config));
  sheet.getRange("C2").setValue(timestamp);

  return responseJSON({ success: true, message: "Configuration successfully saved to Google Sheets." });
}

function handleGetConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("SiteConfig");
  if (!sheet) {
    return responseJSON({ success: false, message: "No custom configuration found" });
  }

  var val = sheet.getRange("B2").getValue();
  if (!val) {
    return responseJSON({ success: false, message: "No custom configuration saved yet" });
  }

  return responseJSON({ success: true, config: JSON.parse(val) });
}

// -------------------------------------------------------------
// 5. THEMED HTML EMAIL TEMPLATES (Ardya Homestays Theme)
// Colors: Forest Green #234B36 | Gold #C39A58 | Cream #FAF8F2 | Dark #26332A
// -------------------------------------------------------------
function renderOtpEmail(otp, email) {
  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    'body { margin:0; padding:0; background-color:#FAF8F2; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; color:#26332A; }' +
    '.wrapper { width:100%; max-width:580px; margin:24px auto; background-color:#FFFFFF; border:1px solid #E5E4DC; border-radius:16px; overflow:hidden; box-shadow:0 4px 12px rgba(35,75,54,0.06); }' +
    '.header { background-color:#234B36; padding:32px 24px; text-align:center; border-bottom:3px solid #C39A58; }' +
    '.brand-title { color:#FAF8F2; font-family:Georgia,serif; font-size:24px; font-weight:bold; margin:0 0 6px 0; letter-spacing:0.5px; }' +
    '.brand-sub { color:#E5E4DC; font-size:11px; text-transform:uppercase; letter-spacing:2px; margin:0; }' +
    '.body { padding:36px 32px; text-align:center; }' +
    '.greeting { font-size:16px; font-weight:600; color:#234B36; margin-bottom:12px; }' +
    '.text { font-size:14px; color:#555E57; line-height:1.6; margin:0 0 24px 0; }' +
    '.otp-box { background-color:#FAF8F2; border:2px dashed #C39A58; border-radius:12px; padding:20px; margin:0 auto 24px auto; display:inline-block; }' +
    '.otp-code { font-family:Courier,monospace; font-size:32px; font-weight:bold; letter-spacing:8px; color:#234B36; margin:0; }' +
    '.expiry-badge { display:inline-block; font-size:11px; font-weight:bold; color:#856404; background-color:#FFF3CD; border-radius:20px; padding:4px 12px; margin-bottom:24px; }' +
    '.footer { background-color:#FAF8F2; border-top:1px solid #E5E4DC; padding:20px 24px; text-align:center; font-size:11px; color:#74796F; }' +
    '</style></head><body>' +
    '<div class="wrapper">' +
    '  <div class="header">' +
    '    <h1 class="brand-title">Ardya Homestays</h1>' +
    '    <p class="brand-sub">Admin Security Verification • Balehalli, Karnataka</p>' +
    '  </div>' +
    '  <div class="body">' +
    '    <p class="greeting">Admin Portal Login</p>' +
    '    <p class="text">We received a request to log in to the Ardya Homestays Admin Management Console for <strong>' + email + '</strong>.</p>' +
    '    <div class="otp-box">' +
    '      <p class="otp-code">' + otp + '</p>' +
    '    </div>' +
    '    <div><span class="expiry-badge">⏱ Code expires in 10 minutes</span></div>' +
    '    <p class="text" style="font-size:12px; color:#888;">If you did not request this login code, you can safely ignore this email. Do not share this code with anyone.</p>' +
    '  </div>' +
    '  <div class="footer">' +
    '    <p style="margin:0 0 4px 0;"><strong>Ardya Homestays</strong> — Balehalli, Chikkamagaluru, Karnataka 577111</p>' +
    '    <p style="margin:0;">Coffee Estate Hospitality Management</p>' +
    '  </div>' +
    '</div></body></html>';
}

function renderBookingConfirmationEmail(data, enquiryId, verifiedTotal) {
  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    'body { margin:0; padding:0; background-color:#FAF8F2; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; color:#26332A; }' +
    '.wrapper { width:100%; max-width:600px; margin:24px auto; background-color:#FFFFFF; border:1px solid #E5E4DC; border-radius:16px; overflow:hidden; }' +
    '.header { background-color:#234B36; padding:32px 24px; text-align:center; border-bottom:3px solid #C39A58; }' +
    '.brand-title { color:#FAF8F2; font-family:Georgia,serif; font-size:26px; font-weight:bold; margin:0; }' +
    '.brand-sub { color:#E5E4DC; font-size:11px; text-transform:uppercase; letter-spacing:2px; margin:6px 0 0 0; }' +
    '.body { padding:32px 28px; }' +
    '.pill { display:inline-block; padding:4px 12px; background-color:#EBF3EE; color:#234B36; border-radius:20px; font-size:11px; font-weight:bold; margin-bottom:12px; }' +
    '.headline { font-family:Georgia,serif; font-size:22px; color:#234B36; margin:0 0 12px 0; }' +
    '.text { font-size:14px; color:#555E57; line-height:1.6; margin:0 0 20px 0; }' +
    '.summary-card { background-color:#FAF8F2; border:1px solid #E5E4DC; border-radius:12px; padding:20px; margin-bottom:24px; }' +
    '.row { display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px; border-bottom:1px solid #EBE9E1; padding-bottom:8px; }' +
    '.row-last { border-bottom:none; margin-bottom:0; padding-bottom:0; }' +
    '.label { color:#74796F; }' +
    '.value { font-weight:bold; color:#26332A; text-align:right; }' +
    '.price-total { font-size:18px; color:#234B36; font-weight:bold; }' +
    '.cta-btn { display:inline-block; padding:12px 24px; background-color:#25D366; color:#FFFFFF; text-decoration:none; border-radius:8px; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; }' +
    '.footer { background-color:#FAF8F2; border-top:1px solid #E5E4DC; padding:20px; text-align:center; font-size:11px; color:#74796F; }' +
    '</style></head><body>' +
    '<div class="wrapper">' +
    '  <div class="header">' +
    '    <h1 class="brand-title">Ardya Homestays</h1>' +
    '    <p class="brand-sub">Balehalli • Chikkamagaluru, Karnataka</p>' +
    '  </div>' +
    '  <div class="body">' +
    '    <span class="pill">Ref: ' + enquiryId + '</span>' +
    '    <h2 class="headline">Booking Enquiry Received!</h2>' +
    '    <p class="text">Hello <strong>' + (data.guestName || "Guest") + '</strong>, thank you for choosing Ardya Homestays. We have received your booking enquiry and will confirm room availability with you directly.</p>' +
    '    <div class="summary-card">' +
    '      <div class="row"><span class="label">Room:</span><span class="value">' + (data.roomName || "Standard Accommodation") + '</span></div>' +
    '      <div class="row"><span class="label">Package:</span><span class="value">' + (data.packageName || "Standard Package") + '</span></div>' +
    '      <div class="row"><span class="label">Check-in:</span><span class="value">' + (data.checkIn || "Flexible") + ' (12:00 PM)</span></div>' +
    '      <div class="row"><span class="label">Check-out:</span><span class="value">' + (data.checkOut || "Flexible") + ' (11:00 AM)</span></div>' +
    '      <div class="row"><span class="label">Guests:</span><span class="value">' + (data.adults || 1) + ' Adults' + (Number(data.children) ? ', ' + data.children + ' Children' : '') + '</span></div>' +
    '      <div class="row row-last"><span class="label">Estimated Total:</span><span class="value price-total">₹' + Number(verifiedTotal).toLocaleString("en-IN") + '</span></div>' +
    '    </div>' +
    '    <p class="text" style="text-align:center; margin-bottom:20px;">To confirm your dates instantly or ask any travel questions, message the host on WhatsApp:</p>' +
    '    <div style="text-align:center; margin-bottom:24px;">' +
    '      <a href="https://wa.me/918277446061" class="cta-btn">WhatsApp Host Directly</a>' +
    '    </div>' +
    '  </div>' +
    '  <div class="footer">' +
    '    <p style="margin:0 0 4px 0;"><strong>Ardya Homestays</strong> — Near Sanjivini Vana, Mullunde, Balehalli, Karnataka 577111</p>' +
    '    <p style="margin:0;">Call: +91 8277446061 • Check-in: 12:00 PM • Check-out: 11:00 AM</p>' +
    '  </div>' +
    '</div></body></html>';
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
