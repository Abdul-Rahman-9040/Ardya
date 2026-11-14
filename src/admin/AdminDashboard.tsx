import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInitialAdminData, saveAdminData, AdminSiteData } from "../services/adminConfigService";
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
  ShieldAlert,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminSiteData>(getInitialAdminData());
  const [activeTab, setActiveTab] = useState<"pricing" | "rooms" | "enquiries" | "business">("pricing");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);

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
      setSaveStatus("All Regular & Premium room configurations and dynamic prices successfully saved! Public website updated immediately.");
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus("Failed to save changes.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ardya_admin_auth");
    navigate("/admin/login");
  };

  // Update Dynamic Pricing for a category
  const updateCategoryPackagePrice = (
    category: RoomCategory,
    packageType: "stay-only" | "stay-with-meals",
    newPrice: number
  ) => {
    const updatedPricing = { ...data.pricingConfig };
    updatedPricing[category].packages[packageType].pricePerPerson = newPrice;
    if (packageType === "stay-only") {
      updatedPricing[category].startingPrice = newPrice;
    }
    setData({ ...data, pricingConfig: updatedPricing });
  };

  // Toggle room availability
  const toggleRoomActive = (roomId: string) => {
    const updatedRooms = data.rooms.map((r) =>
      r.id === roomId ? { ...r, active: !r.active } : r
    );
    setData({ ...data, rooms: updatedRooms });
  };

  const regularRooms = data.rooms.filter((r) => r.category === "Regular");
  const premiumRooms = data.rooms.filter((r) => r.category === "Premium");

  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-20">
      {/* Admin Header - Mobile-first responsive with safe touch targets */}
      <header className="bg-[#234B36] text-white py-3.5 px-4 sm:px-6 border-b border-[#345e47] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-serif font-bold text-base sm:text-lg text-[#FAF8F2] truncate">
              Ardya Homestays
            </span>
            <span className="text-[10px] sm:text-xs bg-[#C39A58] text-[#234B36] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow min-h-[44px]"
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {saveStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{saveStatus}</span>
          </div>
        )}

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E4DC]">
            <p className="text-[11px] text-[#74796F]">Regular Category</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-0.5">2 Rooms</p>
            <p className="text-[11px] text-[#536B45] mt-1 font-medium">Arabica 1 &amp; Arabica 2</p>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E4DC]">
            <p className="text-[11px] text-[#74796F]">Premium Category</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-0.5">2 Rooms</p>
            <p className="text-[11px] text-[#536B45] mt-1 font-medium">Robusta 1 &amp; Robusta 2</p>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E4DC]">
            <p className="text-[11px] text-[#74796F]">Live Enquiries</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36] mt-0.5">{enquiries.length}</p>
            <p className="text-[11px] text-[#536B45] mt-1 font-medium">WhatsApp / App submissions</p>
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E4DC]">
            <p className="text-[11px] text-[#74796F]">Pricing Engine</p>
            <p className="font-serif text-lg sm:text-xl font-bold text-[#234B36] mt-1">Dynamic Central</p>
            <p className="text-[10px] text-[#74796F] mt-0.5">Auto-propagates to all forms</p>
          </div>
        </div>

        {/* Tab Navigation - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto no-scrollbar border-b border-[#E5E4DC] mb-6 sm:mb-8">
          <div className="flex space-x-6 text-sm font-semibold min-w-max pb-1">
            <button
              onClick={() => setActiveTab("pricing")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all min-h-[44px] ${
                activeTab === "pricing"
                  ? "border-[#234B36] text-[#234B36]"
                  : "border-transparent text-[#74796F] hover:text-[#26332A]"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Category Pricing Management</span>
            </button>

            <button
              onClick={() => setActiveTab("rooms")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all min-h-[44px] ${
                activeTab === "rooms"
                  ? "border-[#234B36] text-[#234B36]"
                  : "border-transparent text-[#74796F] hover:text-[#26332A]"
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Room Inventory ({data.rooms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all min-h-[44px] ${
                activeTab === "enquiries"
                  ? "border-[#234B36] text-[#234B36]"
                  : "border-transparent text-[#74796F] hover:text-[#26332A]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Guest Enquiries ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("business")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all min-h-[44px] ${
                activeTab === "business"
                  ? "border-[#234B36] text-[#234B36]"
                  : "border-transparent text-[#74796F] hover:text-[#26332A]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Business Settings</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DYNAMIC CATEGORY PRICING */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#234B36]">
                Centralized Stay Package &amp; Category Pricing
              </h2>
              <p className="text-xs text-[#74796F] mt-1">
                Prices saved here automatically update the booking calculator, public package cards, and pre-filled WhatsApp messages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* REGULAR ROOMS (Arabica) Pricing */}
              <div className="bg-white rounded-2xl border-2 border-[#E5E4DC] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="border-b border-[#E5E4DC] pb-3">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
                    Category: Regular
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#26332A]">
                    Arabica Regular Rooms (Arabica 1 &amp; 2)
                  </h3>
                  <p className="text-xs text-[#74796F] mt-0.5">
                    Coffee Variety: <strong>Arabica</strong> • Billing: Per Person Per Night
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay Only Rate (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Regular.packages["stay-only"].pricePerPerson}
                      onChange={(e) =>
                        updateCategoryPackagePrice("Regular", "stay-only", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl font-bold text-[#234B36] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay with Meals Rate (Breakfast &amp; Dinner) (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Regular.packages["stay-with-meals"].pricePerPerson}
                      onChange={(e) =>
                        updateCategoryPackagePrice("Regular", "stay-with-meals", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl font-bold text-[#234B36] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] text-[11px] text-[#74796F] space-y-1">
                  <p className="font-semibold text-[#234B36]">Inclusions Summary:</p>
                  <p>• Stay Only: Room accommodation only, meals not included</p>
                  <p>• Stay with Meals: Complimentary Malnad home breakfast &amp; dinner included</p>
                </div>
              </div>

              {/* PREMIUM ROOMS (Robusta) Pricing */}
              <div className="bg-white rounded-2xl border-2 border-[#C39A58] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="border-b border-[#E5E4DC] pb-3">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C39A58] block">
                    Category: Premium
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#26332A]">
                    Robusta Premium Suites (Robusta 1 &amp; 2)
                  </h3>
                  <p className="text-xs text-[#74796F] mt-0.5">
                    Coffee Variety: <strong>Robusta</strong> • Billing: Per Person Per Night
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay Only Rate (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Premium.packages["stay-only"].pricePerPerson}
                      onChange={(e) =>
                        updateCategoryPackagePrice("Premium", "stay-only", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl font-bold text-[#234B36] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#26332A] mb-1">
                      Stay with Meals Rate (Breakfast &amp; Dinner) (₹ / person / night)
                    </label>
                    <input
                      type="number"
                      value={data.pricingConfig.Premium.packages["stay-with-meals"].pricePerPerson}
                      onChange={(e) =>
                        updateCategoryPackagePrice("Premium", "stay-with-meals", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl font-bold text-[#234B36] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] text-[11px] text-[#74796F] space-y-1">
                  <p className="font-semibold text-[#234B36]">Inclusions Summary:</p>
                  <p>• Premium Suite accommodation with seating corner and elevated veranda</p>
                  <p>• Stay with Meals: Complimentary traditional Malnad breakfast &amp; dinner</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOM INVENTORY */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#234B36]">
                Room Management (4 Total Rooms)
              </h2>
              <p className="text-xs text-[#74796F] mt-1">
                2 Regular Rooms (Arabica) + 2 Premium Rooms (Robusta).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl border border-[#E5E4DC] p-5 sm:p-6 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        <img src={room.coverImage} alt={room.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#C39A58]">
                          {room.category} • {room.variety}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#26332A]">
                          {room.name}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRoomActive(room.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors min-h-[32px] ${
                        room.active
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                          : "text-gray-500 bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {room.active ? "Available" : "Paused"}
                    </button>
                  </div>

                  <p className="text-xs text-[#74796F] line-clamp-2">{room.shortDescription}</p>

                  <div className="text-xs space-y-1 pt-2 border-t border-[#E5E4DC]">
                    <p><strong>Bedding:</strong> {room.capacity.bedConfiguration}</p>
                    <p><strong>Capacity:</strong> Max {room.capacity.maxGuests} Guests</p>
                    <p><strong>Photos Loaded:</strong> {room.galleryImages.length + 1} HD camera &amp; drone shots</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#234B36]">
                  Guest Booking Enquiries
                </h2>
                <p className="text-xs text-[#74796F]">
                  Real guest submissions captured with exact room, category, and price calculation.
                </p>
              </div>

              <button
                onClick={() => {
                  const stored = JSON.parse(localStorage.getItem("ardya_enquiries") || "[]");
                  setEnquiries(stored);
                }}
                className="flex items-center space-x-1 text-xs text-[#234B36] hover:underline min-h-[44px] px-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E4DC] space-y-3">
                <MessageSquare className="w-10 h-10 text-[#74796F]/40 mx-auto" />
                <p className="font-semibold text-sm text-[#26332A]">No Enquiries Received Yet</p>
                <p className="text-xs text-[#74796F] max-w-sm mx-auto">
                  When guests submit a booking enquiry, the full breakdown will display here and sync to Google Sheets.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E4DC] overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-[#FAF8F2] border-b border-[#E5E4DC] text-[#26332A] uppercase font-bold">
                    <tr>
                      <th className="p-3.5">ID / Date</th>
                      <th className="p-3.5">Guest</th>
                      <th className="p-3.5">Dates / Nights</th>
                      <th className="p-3.5">Room &amp; Category</th>
                      <th className="p-3.5">Package</th>
                      <th className="p-3.5">Total Estimated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E4DC]">
                    {enquiries.map((enq, i) => (
                      <tr key={i} className="hover:bg-[#FAF8F2]/60">
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-[#234B36]">{enq.enquiryId}</p>
                          <p className="text-[10px] text-[#74796F]">{enq.submittedAt?.split("T")[0]}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-[#26332A]">{enq.guestName}</p>
                          <a href={`tel:${enq.mobileNumber}`} className="text-xs text-[#234B36] hover:underline">
                            {enq.mobileNumber}
                          </a>
                        </td>
                        <td className="p-3.5">
                          <p>{enq.checkIn} to {enq.checkOut}</p>
                          <p className="text-[#74796F]">{enq.numberOfNights} Nights • {enq.totalGuests} Guests</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-[#26332A]">{enq.roomName}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="text-[#74796F]">{enq.packageName}</p>
                        </td>
                        <td className="p-3.5 font-bold font-serif text-sm text-[#234B36]">
                          {formatCurrency(enq.estimatedTotal || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BUSINESS SETTINGS */}
        {activeTab === "business" && (
          <div className="bg-white rounded-2xl border border-[#E5E4DC] p-6 sm:p-8 space-y-4 max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#234B36]">
              Verified Business Information
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#74796F] font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  value={data.business.name}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#74796F] font-semibold mb-1">Host Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={data.business.phone}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#74796F] font-semibold mb-1">Verified Google Maps Link</label>
                <input
                  type="text"
                  value={data.business.googleMapsUrl}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
