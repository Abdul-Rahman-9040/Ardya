import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { getAppsScriptUrl } from "../services/enquiryService";

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState((import.meta as any).env?.VITE_ADMIN_EMAIL || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"enter-email" | "enter-otp">("enter-email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Apps Script endpoint (from env, admin config, or fallback)
  const appsScriptUrl = getAppsScriptUrl();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Request OTP from Google Apps Script
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "sendOTP",
          email: email.trim(),
        }),
      });

      const resData = await response.json().catch(() => null);
      if (resData && !resData.success) {
        setError(resData.error || "This email is not registered as an authorized administrator.");
        setLoading(false);
        return;
      }

      setSuccessMsg("A 6-digit verification code has been sent. Please check your email inbox & spam folder.");
      setStep("enter-otp");
      setCountdown(60);
    } catch {
      setError("Unable to connect to verification server. Please try again or check network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP strictly via backend
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanOtp = otp.trim();

    try {
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "verifyOTP",
          email: email.trim(),
          otp: cleanOtp,
        }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("ardya_admin_auth", "true");
        sessionStorage.setItem("ardya_admin_email", email.trim().toLowerCase());
        navigate("/admin");
      } else {
        setError(data.error || "Invalid verification code. Please check and try again.");
      }
    } catch {
      setError("Verification failed or server timed out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F2] px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5E4DC] p-6 sm:p-10 shadow-lg space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#234B36]/10 text-[#234B36] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7 text-[#C39A58]" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C39A58] block">
            Protected Staff Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#234B36]">
            Ardya Admin Login
          </h1>
          <p className="text-xs text-[#74796F]">
            Secure One-Time Passcode (OTP) verification
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ENTER ADMIN EMAIL */}
        {step === "enter-email" ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#26332A] mb-1.5">
                Authorized Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#74796F]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. ardyahomestays@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F2] border border-[#E5E4DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234B36]"
                />
              </div>
              <p className="text-[10px] text-[#74796F] mt-1.5">
                A 6-digit one-time passcode will be sent to your authorized inbox.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#234B36] hover:bg-[#536B45] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 min-h-[44px]"
            >
              <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: ENTER OTP */
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#26332A]">
                  Enter 6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep("enter-email")}
                  className="text-[11px] text-[#C39A58] hover:underline font-semibold"
                >
                  Change Email
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-[0.5em] text-2xl font-bold font-mono py-2.5 bg-[#FAF8F2] border-2 border-[#234B36] rounded-xl focus:outline-none shadow-inner"
              />
              <div className="flex items-center justify-between mt-2 text-[11px] text-[#74796F]">
                <span className="truncate max-w-[200px]">Sent to: <strong>{email}</strong></span>
                {countdown > 0 ? (
                  <span className="text-amber-700 font-semibold">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    className="text-[#234B36] font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#C39A58] hover:bg-[#b08745] text-[#234B36] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50 min-h-[44px]"
            >
              <span>{loading ? "Verifying..." : "Verify & Access Panel"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E5E4DC] text-center text-xs text-[#74796F]">
          <p>Direct URL: <span className="font-mono text-gray-800">/admin</span></p>
          <p className="text-[10px] text-gray-400 mt-0.5">Zero public UI navigation links</p>
        </div>
      </div>
    </div>
  );
};
