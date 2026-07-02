"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");
    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/verify-login-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      saveAuth(data.accessToken, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2530] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2530] via-[#0d2d3a] to-[#123847]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#123847]/40 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            AstroERP
          </Link>
          <Link
            href="/"
            className="text-white/40 text-xs hover:text-white/70 transition-colors flex items-center gap-1"
          >
            ← Back to home
          </Link>
        </div>

        <div className="relative space-y-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Campus management, reimagined
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome back to
            <br />
            <span className="text-emerald-400">your campus.</span>
          </h1>

          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Access your timetable, tasks, attendance, notices, and notes — all in one place, built for how your campus actually works.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: "📅", label: "Smart Timetable & Task Tracking" },
              { icon: "📊", label: "Real-time Attendance Analytics" },
              { icon: "📚", label: "Shared Notes & Class Resources" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/70 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between">
          <span className="text-white/20 text-xs">© 2026 AstroERP</span>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full"></span>
            All systems operational
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-[#0B2530] font-bold text-xl">
              AstroERP
            </Link>
          </div>

          {step === "password" ? (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-emerald-700 text-xs font-medium mb-4">
                  👋 Good to see you again
                </div>
                <h2 className="text-3xl font-bold text-[#0B2530]">Log in to your account</h2>
                <p className="text-gray-500 text-sm mt-1.5">Enter your credentials to continue</p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Sending code...
                    </>
                  ) : (
                    <>
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-gray-400 text-xs">New to AstroERP?</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <Link
                href="/signup"
                className="w-full block text-center border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-[#0B2530] font-semibold py-3.5 rounded-xl transition-all"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-4">✉️</div>
                <h2 className="text-3xl font-bold text-[#0B2530]">Verify your email</h2>
                <p className="text-gray-500 text-sm mt-1.5">
                  We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl text-center text-2xl tracking-[0.5em] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? "Verifying..." : "Verify & Log in"}
                </button>
              </form>

              <div className="flex items-center justify-between mt-4 text-sm">
                <button
                  onClick={() => setStep("password")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-emerald-600 font-medium hover:underline disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}