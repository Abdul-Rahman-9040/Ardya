import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { businessConfig } from "../data/businessConfig";

export const AdminLogin: React.FC = () => {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Secure authentication check:
    // Matches environment variable if provided, or default master setup passcode
    const validKey = (import.meta as any).env?.VITE_ADMIN_KEY || "ardya2026";

    setTimeout(() => {
      if (accessKey === validKey) {
        sessionStorage.setItem("ardya_admin_auth", "true");
        navigate("/admin");
      } else {
        setError("Invalid Admin Access Passcode. Please check and try again.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF8F2] px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E4DC] p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#234B36]/10 text-[#234B36] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#234B36]">
            Ardya Homestays Admin
          </h1>
          <p className="text-xs text-[#74796F]">
            Lightweight configuration and enquiry management panel
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#26332A] mb-1.5">
              Admin Access Key / Passcode
            </label>
            <input
              type="password"
              required
              placeholder="Enter admin passcode"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            />
            <p className="text-[10px] text-[#74796F] mt-1">
              Default development key: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">ardya2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow disabled:opacity-50"
          >
            <span>{loading ? "Verifying..." : "Access Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E4DC] text-center text-xs text-[#74796F]">
          <p>Protected Hospitality Management Console</p>
        </div>
      </div>
    </div>
  );
};
