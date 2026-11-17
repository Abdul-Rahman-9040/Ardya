import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInitialAdminData,
  saveAdminData,
  AdminSiteData,
  AmenityItem,
  FoodDiningConfig,
} from "../services/adminConfigService";
import { RoomCategory } from "../data/pricingConfig";
import { formatCurrency } from "../utils/cn";
import {
  Package,
  BedDouble,
  FileText,
  MessageSquare,
  LogOut,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
  Coffee,
  Check,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminSiteData>(getInitialAdminData());
  const [activeTab, setActiveTab] = useState<
    "pricing" | "amenities" | "fnb" | "rooms" | "business" | "enquiries" | "emails"
  >("pricing");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailSentSuccess, setEmailSentSuccess] = useState<Record<string, boolean>>({});

  // New amenity form state
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityCategory, setNewAmenityCategory] = useState<AmenityItem["category"]>("Nature & Estate");
  const [newAmenityDesc, setNewAmenityDesc] = useState("");

  useEffect(() => {
    // Auth Guard
    const auth = sessionStorage.getItem("ardya_admin_auth");
    if (!auth) {
      navigate("/admin/login");
      return;
    }

    // Load Local Enquiries
    try {
      const storedEnquiries = JSON.parse(localStorage.getItem("ardya_enquiries") || "[]");
      setEnquiries(storedEnquiries);
    } catch {
      setEnquiries([]);
    }
  }, [navigate]);

  const handleSave = () => {
    const success = saveAdminData(data);
    if (success) {
      setSaveStatus("All pricing, amenities, dining, and business details saved successfully! Live website updated.");
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus("Failed to save changes.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ardya_admin_auth");
    sessionStorage.removeItem("ardya_admin_email");
    navigate("/admin/login");
  };

  // 1. Pricing Updates
  const updatePrice = (
    category: RoomCategory,
    pkg: "stay-only" | "stay-with-meals",
    value: number
  ) => {
    const updated = { ...data.pricingConfig };
    updated[category].packages[pkg].pricePerPerson = value;
    if (pkg === "stay-only") {
      updated[category].startingPrice = value;
    }
    setData({ ...data, pricingConfig: updated });
  };

  // 2. Amenities Updates
  const toggleAmenity = (id: string) => {
    const updated = data.amenities.map((item) =>
      item.id === id ? { ...item, included: !item.included } : item
    );
    setData({ ...data, amenities: updated });
  };

  const deleteAmenity = (id: string) => {
    const updated = data.amenities.filter((item) => item.id !== id);
    setData({ ...data, amenities: updated });
  };

  const addAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) return;

    const newItem: AmenityItem = {
      id: "amenity-" + Date.now(),
      name: newAmenityName.trim(),
      category: newAmenityCategory,
      description: newAmenityDesc.trim() || "Exclusive feature at Ardya Homestays.",
      included: true,
    };

    setData({ ...data, amenities: [...data.amenities, newItem] });
    setNewAmenityName("");
    setNewAmenityDesc("");
  };

  // 3. FnB Updates
  const updateFnB = (field: keyof FoodDiningConfig, value: any) => {
    setData({
      ...data,
      foodDining: {
        ...data.foodDining,
        [field]: value,
      },
    });
  };

  // 4. Business info updates
  const updateBusiness = (field: string, value: any) => {
    setData({
      ...data,
      business: {
        ...data.business,
        [field]: value,
      },
    });
  };

  // 5. Enquiry Status Update
  const updateEnquiryStatus = (enquiryId: string, newStatus: string) => {
    const updated = enquiries.map((enq) =>
      enq.enquiryId === enquiryId ? { ...enq, status: newStatus } : enq
    );
    setEnquiries(updated);
    localStorage.setItem("ardya_enquiries", JSON.stringify(updated));
  };

  const handleSendOfficialConfirmation = async (enq: any) => {
    let guestEmail = enq.email;
    if (!guestEmail || guestEmail.indexOf("@") === -1) {
      const prompted = prompt(
        "Please enter the guest's email address to send their official confirmation voucher:",
        ""
      );
      if (!prompted || !prompted.includes("@")) return;
      guestEmail = prompted.trim();
      enq.email = guestEmail;
    }

    setSendingEmailId(enq.enquiryId);
    const scriptUrl = data.googleAppsScriptUrl || (import.meta as any).env?.VITE_APPS_SCRIPT_URL;

    try {
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "sendBookingConfirmation",
            data: {
              ...enq,
              email: guestEmail,
            },
          }),
        });
      }
      updateEnquiryStatus(enq.enquiryId, "Confirmed");
      setEmailSentSuccess((prev) => ({ ...prev, [enq.enquiryId]: true }));
      setSaveStatus(`Official Confirmation Email dispatched to ${guestEmail} for Reference #${enq.enquiryId}!`);
      setTimeout(() => setSaveStatus(null), 5000);
    } catch {
      alert("Could not connect to Google Apps Script. Please verify the URL in Contact & Hours.");
    } finally {
      setSendingEmailId(null);
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      (enq.guestName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.mobileNumber || "").includes(searchQuery) ||
      (enq.enquiryId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text: string, templateName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(templateName);
    setTimeout(() => setCopiedTemplate(null), 3000);
  };

  // Themed HTML email strings
  const otpEmailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Ardya Homestays OTP</title></head>
<body style="margin:0;padding:0;background-color:#FAF8F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#26332A;">
  <div style="max-width:580px;margin:24px auto;background:#fff;border:1px solid #E5E4DC;border-radius:16px;overflow:hidden;">
    <div style="background-color:#234B36;padding:32px 24px;text-align:center;border-bottom:3px solid #C39A58;">
      <h1 style="color:#FAF8F2;font-family:Georgia,serif;font-size:24px;margin:0;">Ardya Homestays</h1>
      <p style="color:#E5E4DC;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:6px 0 0;">Admin Security Verification • Balehalli</p>
    </div>
    <div style="padding:36px 32px;text-align:center;">
      <h2 style="font-size:18px;color:#234B36;margin-bottom:12px;">Admin Portal Login</h2>
      <p style="font-size:14px;color:#555E57;line-height:1.6;">Use the 6-digit verification code below to access the management console:</p>
      <div style="background:#FAF8F2;border:2px dashed #C39A58;border-radius:12px;padding:20px;display:inline-block;margin:16px 0;">
        <span style="font-family:Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:8px;color:#234B36;">{{OTP_CODE}}</span>
      </div>
      <p style="font-size:12px;color:#856404;background:#FFF3CD;display:inline-block;padding:4px 12px;border-radius:20px;">⏱ Valid for 10 minutes</p>
    </div>
    <div style="background:#FAF8F2;border-top:1px solid #E5E4DC;padding:16px;text-align:center;font-size:11px;color:#74796F;">
      Ardya Homestays — Balehalli, Chikkamagaluru, Karnataka 577111
    </div>
  </div>
</body>
</html>`;

  const confirmationEmailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Booking Confirmation</title></head>
<body style="margin:0;padding:0;background-color:#FAF8F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#26332A;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border:1px solid #E5E4DC;border-radius:16px;overflow:hidden;">
    <div style="background-color:#234B36;padding:32px 24px;text-align:center;border-bottom:3px solid #C39A58;">
      <h1 style="color:#FAF8F2;font-family:Georgia,serif;font-size:26px;margin:0;">Ardya Homestays</h1>
      <p style="color:#E5E4DC;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:6px 0 0;">Balehalli • Chikkamagaluru, Karnataka</p>
    </div>
    <div style="padding:32px 28px;">
      <span style="background:#EBF3EE;color:#234B36;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;">Ref: {{ENQUIRY_ID}}</span>
      <h2 style="font-family:Georgia,serif;font-size:22px;color:#234B36;margin:12px 0;">Booking Enquiry Confirmed</h2>
      <p style="font-size:14px;color:#555E57;line-height:1.6;">Hello <strong>{{GUEST_NAME}}</strong>, we look forward to hosting you amidst our serene coffee plantations.</p>
      <div style="background:#FAF8F2;border:1px solid #E5E4DC;border-radius:12px;padding:20px;margin:20px 0;">
        <div style="display:flex;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid #EBE9E1;font-size:13px;"><span>Room:</span><strong>{{ROOM_NAME}}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #EBE9E1;font-size:13px;"><span>Check-in:</span><strong>{{CHECK_IN}} (12:00 PM)</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #EBE9E1;font-size:13px;"><span>Check-out:</span><strong>{{CHECK_OUT}} (11:00 AM)</strong></div>
        <div style="display:flex;justify-content:space-between;padding-top:8px;font-size:16px;color:#234B36;font-weight:bold;"><span>Total:</span><span>{{ESTIMATED_TOTAL}}</span></div>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://wa.me/918277446061" style="background:#25D366;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:13px;text-transform:uppercase;">WhatsApp Host Directly</a>
      </div>
    </div>
    <div style="background:#FAF8F2;border-top:1px solid #E5E4DC;padding:16px;text-align:center;font-size:11px;color:#74796F;">
      Ardya Homestays — near Sanjivini Vana, Mullunde, Balehalli, Karnataka 577111
    </div>
  </div>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-24">
      {/* Header */}
      <header className="bg-[#234B36] text-white py-3.5 px-4 sm:px-6 border-b border-[#345e47] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="font-serif font-bold text-base sm:text-lg text-[#FAF8F2]">
              Ardya Homestays
            </span>
            <span className="text-[10px] sm:text-xs bg-[#C39A58] text-[#234B36] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Admin Console
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 min-h-[44px]"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-xs text-white/80 hover:text-white transition-colors min-h-[44px] px-2"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {saveStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{saveStatus}</span>
          </div>
        )}

        {/* Overview Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-[#74796F]">Regular Room Rate</p>
            <p className="font-serif text-2xl font-bold text-[#234B36] mt-0.5">
              ₹{data.pricingConfig.Regular.startingPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-[#536B45]">Arabica 1 &amp; 2</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-[#74796F]">Premium Suite Rate</p>
            <p className="font-serif text-2xl font-bold text-[#234B36] mt-0.5">
              ₹{data.pricingConfig.Premium.startingPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-[#536B45]">Robusta 1 &amp; 2</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-[#74796F]">Active Amenities</p>
            <p className="font-serif text-2xl font-bold text-[#234B36] mt-0.5">
              {data.amenities.filter((a) => a.included).length}
            </p>
            <p className="text-[11px] text-[#536B45]">Campfire, Walks &amp; Geyser</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-[#74796F]">Enquiries Logged</p>
            <p className="font-serif text-2xl font-bold text-[#234B36] mt-0.5">{enquiries.length}</p>
            <p className="text-[11px] text-[#536B45]">Google Sheets sync ready</p>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="overflow-x-auto no-scrollbar border-b border-[#E5E4DC] mb-6 sm:mb-8">
          <div className="flex space-x-2 sm:space-x-4 text-xs font-bold min-w-max pb-1">
            <button
              onClick={() => setActiveTab("pricing")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "pricing"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pricing Management</span>
            </button>

            <button
              onClick={() => setActiveTab("amenities")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "amenities"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Amenities ({data.amenities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("fnb")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "fnb"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Food &amp; Dining (FnB)</span>
            </button>

            <button
              onClick={() => setActiveTab("rooms")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "rooms"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Rooms Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab("business")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "business"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contact &amp; Hours</span>
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "enquiries"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquiries ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("emails")}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-h-[44px] ${
                activeTab === "emails"
                  ? "bg-[#234B36] text-white shadow-xs"
                  : "bg-white text-[#74796F] hover:text-[#26332A] border border-[#E5E4DC]"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>HTML Email Templates</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PRICING MANAGEMENT */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regular Category Card */}
              <div className="p-6 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E4DC] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                      Variety: Arabica
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#234B36]">
                      Regular Rooms Pricing
                    </h3>
                  </div>
                  <span className="text-xs bg-[#FAF8F2] border border-[#E5E4DC] px-2.5 py-1 rounded-full font-bold">
                    Arabica 1 &amp; 2
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay Only Rate (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Regular.packages["stay-only"].pricePerPerson}
                      onChange={(e) => updatePrice("Regular", "stay-only", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay with Meals (B'fast &amp; Dinner) (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Regular.packages["stay-with-meals"].pricePerPerson}
                      onChange={(e) => updatePrice("Regular", "stay-with-meals", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                    />
                  </div>
                </div>
              </div>

              {/* Premium Category Card */}
              <div className="p-6 bg-white rounded-3xl border border-[#C39A58] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E4DC] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                      Variety: Robusta
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#234B36]">
                      Premium Suites Pricing
                    </h3>
                  </div>
                  <span className="text-xs bg-[#C39A58]/20 border border-[#C39A58]/40 text-[#234B36] px-2.5 py-1 rounded-full font-bold">
                    Robusta 1 &amp; 2
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay Only Rate (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Premium.packages["stay-only"].pricePerPerson}
                      onChange={(e) => updatePrice("Premium", "stay-only", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay with Meals (B'fast &amp; Dinner) (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Premium.packages["stay-with-meals"].pricePerPerson}
                      onChange={(e) => updatePrice("Premium", "stay-with-meals", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Child & Extra Person Policy Note */}
            <div className="p-5 bg-white rounded-2xl border border-[#E5E4DC] text-xs text-[#74796F] flex items-center justify-between">
              <div>
                <strong className="text-[#26332A]">Standard Child Policy:</strong> Children under 5 stay complimentary. Children aged 5–10 are calculated at 50% of the selected per-person package rate automatically.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AMENITIES MANAGEMENT */}
        {activeTab === "amenities" && (
          <div className="space-y-6">
            {/* Add New Amenity Form */}
            <form onSubmit={addAmenity} className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E5E4DC] space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#234B36] flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#C39A58]" />
                <span>Add New Estate Amenity or Feature</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#26332A] mb-1">Amenity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bird Watching Trails, Barbeque Set"
                    value={newAmenityName}
                    onChange={(e) => setNewAmenityName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#26332A] mb-1">Category</label>
                  <select
                    value={newAmenityCategory}
                    onChange={(e) => setNewAmenityCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                  >
                    <option value="Nature & Estate">Nature &amp; Estate</option>
                    <option value="Room Comfort">Room Comfort</option>
                    <option value="Food & Dining">Food &amp; Dining</option>
                    <option value="Convenience">Convenience</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[#26332A] mb-1">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Brief detail of this amenity"
                    value={newAmenityDesc}
                    onChange={(e) => setNewAmenityDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Amenity</span>
              </button>
            </form>

            {/* List of Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.amenities.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    item.included
                      ? "bg-white border-[#E5E4DC] shadow-2xs"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold text-[#C39A58] bg-[#C39A58]/10 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      {item.included ? (
                        <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-500">Disabled</span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#26332A]">{item.name}</h4>
                    <p className="text-xs text-[#74796F] leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
                        item.included
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      title={item.included ? "Disable Amenity" : "Enable Amenity"}
                    >
                      {item.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAmenity(item.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Delete Amenity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FOOD & DINING (FnB) */}
        {activeTab === "fnb" && (
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-6">
            <div className="border-b border-[#E5E4DC] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                Hospitality Dining
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#234B36]">
                Food &amp; Dining (FnB) Configuration
              </h3>
              <p className="text-xs text-[#74796F] mt-1">
                Customize meal packages, regional delicacies, and breakfast/dinner inclusions shown to guests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Breakfast Menu Details
                </label>
                <textarea
                  rows={3}
                  value={data.foodDining.breakfastMenu}
                  onChange={(e) => updateFnB("breakfastMenu", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Dinner Menu Details
                </label>
                <textarea
                  rows={3}
                  value={data.foodDining.dinnerMenu}
                  onChange={(e) => updateFnB("dinnerMenu", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Lunch Policy Note
                </label>
                <textarea
                  rows={2}
                  value={data.foodDining.lunchPolicy}
                  onChange={(e) => updateFnB("lunchPolicy", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Malnad Regional Specialties
                </label>
                <textarea
                  rows={2}
                  value={data.foodDining.malnadSpecialties}
                  onChange={(e) => updateFnB("malnadSpecialties", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>
            </div>

            <div className="border-t border-[#E5E4DC] pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.foodDining.vegNonVegAvailable}
                  onChange={(e) => updateFnB("vegNonVegAvailable", e.target.checked)}
                  className="w-4 h-4 text-[#234B36] rounded"
                />
                <span className="text-xs font-semibold text-[#26332A]">Both Veg &amp; Non-Veg Available</span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.foodDining.unlimitedFilterCoffee}
                  onChange={(e) => updateFnB("unlimitedFilterCoffee", e.target.checked)}
                  className="w-4 h-4 text-[#234B36] rounded"
                />
                <span className="text-xs font-semibold text-[#26332A]">Complimentary Filter Coffee</span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E4DC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.foodDining.campfireEveningIncluded}
                  onChange={(e) => updateFnB("campfireEveningIncluded", e.target.checked)}
                  className="w-4 h-4 text-[#234B36] rounded"
                />
                <span className="text-xs font-semibold text-[#26332A]">Campfire Evening Included</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: ROOMS INVENTORY */}
        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.rooms.map((room) => (
              <div
                key={room.id}
                className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#E5E4DC] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                      {room.category} ({room.variety})
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#234B36]">{room.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      room.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.active ? "Available" : "Maintenance"}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-[#74796F]">
                  <p><strong>Bedding:</strong> {room.capacity.bedConfiguration}</p>
                  <p><strong>Capacity:</strong> Up to {room.capacity.maxGuests} Guests</p>
                  <p><strong>Description:</strong> {room.shortDescription}</p>
                </div>

                <div className="pt-2 border-t border-[#E5E4DC] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#234B36]">
                    ₹{room.startingPrice.toLocaleString("en-IN")} / person
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.rooms.map((r) =>
                        r.id === room.id ? { ...r, active: !r.active } : r
                      );
                      setData({ ...data, rooms: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold min-h-[36px] ${
                      room.active
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {room.active ? "Mark Under Maintenance" : "Make Room Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: BUSINESS & CONTACT DETAILS */}
        {activeTab === "business" && (
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-6">
            <div className="border-b border-[#E5E4DC] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                Hospitality Coordinates
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#234B36]">
                Business Contact &amp; Operating Hours
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Host Calling Number
                </label>
                <input
                  type="text"
                  value={data.business.phone}
                  onChange={(e) => updateBusiness("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  WhatsApp Contact Number (Without +)
                </label>
                <input
                  type="text"
                  value={data.business.phone}
                  onChange={(e) => updateBusiness("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Standard Check-in Time
                </label>
                <input
                  type="text"
                  value={data.business.checkInTime}
                  onChange={(e) => updateBusiness("checkInTime", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Standard Check-out Time
                </label>
                <input
                  type="text"
                  value={data.business.checkOutTime}
                  onChange={(e) => updateBusiness("checkOutTime", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Full Postal Property Address
                </label>
                <input
                  type="text"
                  value={data.business.fullAddressNote}
                  onChange={(e) => updateBusiness("fullAddressNote", e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#26332A] mb-1">
                  Google Apps Script Web App Deployment URL (Optional for live sync)
                </label>
                <input
                  type="text"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={data.googleAppsScriptUrl || ""}
                  onChange={(e) => setData({ ...data, googleAppsScriptUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ENQUIRIES MANAGEMENT */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="p-4 bg-white rounded-2xl border border-[#E5E4DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#74796F]" />
                <input
                  type="text"
                  placeholder="Search guest name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-[#74796F] font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none"
                >
                  <option value="all">All Enquiries ({enquiries.length})</option>
                  <option value="New">New</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Enquiries List */}
            {filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E4DC] space-y-2">
                <MessageSquare className="w-10 h-10 text-[#C39A58] mx-auto opacity-50" />
                <p className="font-serif text-lg font-bold text-[#234B36]">No Enquiries Found</p>
                <p className="text-xs text-[#74796F]">
                  Guest enquiries submitted via the booking form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEnquiries.map((enq) => (
                  <div
                    key={enq.enquiryId}
                    className="p-5 bg-white rounded-2xl border border-[#E5E4DC] shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E4DC] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#74796F] uppercase">
                          {enq.enquiryId}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#26332A]">
                          {enq.guestName || "Guest"}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={enq.status || "New"}
                          onChange={(e) => updateEnquiryStatus(enq.enquiryId, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            enq.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : enq.status === "Cancelled"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="New">Status: New</option>
                          <option value="Confirmed">Status: Confirmed</option>
                          <option value="Cancelled">Status: Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#74796F]">
                      <div>
                        <span>Room:</span>
                        <p className="font-semibold text-[#26332A]">{enq.roomName || "Standard"}</p>
                      </div>
                      <div>
                        <span>Dates:</span>
                        <p className="font-semibold text-[#26332A]">{enq.checkIn} → {enq.checkOut}</p>
                      </div>
                      <div>
                        <span>Guests:</span>
                        <p className="font-semibold text-[#26332A]">
                          {enq.adults || 1} Adults, {enq.children || 0} Kids
                        </p>
                      </div>
                      <div>
                        <span>Estimated Total:</span>
                        <p className="font-bold text-[#234B36]">
                          ₹{Number(enq.estimatedTotal || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        disabled={sendingEmailId === enq.enquiryId}
                        onClick={() => handleSendOfficialConfirmation(enq)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                          emailSentSuccess[enq.enquiryId]
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-[#234B36] text-white hover:bg-[#536B45]"
                        } disabled:opacity-50`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>
                          {sendingEmailId === enq.enquiryId
                            ? "Sending Voucher..."
                            : emailSentSuccess[enq.enquiryId]
                            ? "Resend Confirmation Voucher"
                            : "Send Official Confirmation Email"}
                        </span>
                      </button>

                      <a
                        href={`https://wa.me/${String(enq.mobileNumber).replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${enq.mobileNumber}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#234B36] text-[#234B36] text-xs font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Guest</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: HTML EMAIL TEMPLATES (MATCHING ARDYA THEME) */}
        {activeTab === "emails" && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E4DC] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                    Ardya Branded HTML
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#234B36]">
                    Template 1: Admin Login OTP Verification Email
                  </h3>
                  <p className="text-xs text-[#74796F]">
                    Dispatched automatically by Google Apps Script when admin requests an OTP.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(otpEmailHtml, "otp")}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 min-h-[40px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTemplate === "otp" ? "Copied HTML!" : "Copy HTML"}</span>
                </button>
              </div>

              <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E5E4DC] max-h-56 overflow-y-auto">
                <pre className="text-[11px] font-mono text-[#26332A] whitespace-pre-wrap">
                  {otpEmailHtml}
                </pre>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E5E4DC] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E4DC] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C39A58]">
                    Ardya Branded HTML
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#234B36]">
                    Template 2: Guest Booking Enquiry Confirmation Email
                  </h3>
                  <p className="text-xs text-[#74796F]">
                    Dispatched to guests upon booking form submission with summary &amp; WhatsApp link.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(confirmationEmailHtml, "confirm")}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 min-h-[40px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTemplate === "confirm" ? "Copied HTML!" : "Copy HTML"}</span>
                </button>
              </div>

              <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#E5E4DC] max-h-56 overflow-y-auto">
                <pre className="text-[11px] font-mono text-[#26332A] whitespace-pre-wrap">
                  {confirmationEmailHtml}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
