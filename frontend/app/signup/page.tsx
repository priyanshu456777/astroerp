"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      if (role === "admin") {
        router.push("/login?pending=true");
      } else {
        saveAuth(data.user, data.accessToken);
        router.push("/dashboard");
      }
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2530] to-[#123847]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative">
          <Link href="/" className="text-white font-bold text-xl">AstroERP</Link>
        </div>

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Join your campus today
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Your campus life,<br />
            <span className="text-emerald-400">organized.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Create your account and get instant access to timetables, tasks, attendance tracking, and more.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: "📅", label: "Timetable" },
              { icon: "✅", label: "Tasks" },
              { icon: "📊", label: "Attendance" },
              { icon: "📝", label: "Notes" },
              { icon: "📢", label: "Notices" },
              { icon: "📚", label: "Shared Notes" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-white/60 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/20 text-xs">
          © 2026 AstroERP
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-[#0B2530] font-bold text-xl">AstroERP</Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0B2530]">Create your account</h2>
            <p className="text-gray-500 text-sm mt-1">Get started with AstroERP for free</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priyanshu Sharma"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {["student", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all capitalize ${
                      role === r
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {r === "student" ? "🎓 Student" : "👨‍💼 Admin"}
                  </button>
                ))}
              </div>
              {role === "admin" && (
                <p className="text-xs text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Admin accounts require Super Admin approval before access is granted.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}