"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

const STREAMS = [
  "AIDS", "CSE", "AI & Robotics", "AIML", "BCA", "BA", "BBA", "B.Com", "BSc", "Mechanical",
];
const SECTIONS = ["A", "B", "C", "D"];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  // Student fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [stream, setStream] = useState("");
  const [section, setSection] = useState("");

  // Admin fields
  const [teachingStream, setTeachingStream] = useState("");
  const [teachingSection, setTeachingSection] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student" && (!age || !gender || !dob || !stream || !section)) {
      setError("Please fill in all student details");
      return;
    }
    if (role === "admin" && (!teachingStream || !teachingSection)) {
      setError("Please select the stream and section you teach");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { name, email, password, role };

      if (role === "student") {
        payload.age = age;
        payload.gender = gender;
        payload.dob = dob;
        payload.stream = stream;
        payload.section = section;
      } else {
        payload.teachingStream = teachingStream;
        payload.teachingSection = teachingSection;
      }

      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (role === "admin") {
        router.push("/login?pending=true");
      } else {
        saveAuth(data.accessToken, data.user);
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(["student", "admin"] as const).map((r) => (
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

            {/* Student-only fields */}
            {role === "student" && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="19"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stream</label>
                    <select
                      required
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select stream</option>
                      {STREAMS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
                    <select
                      required
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select section</option>
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Admin-only fields */}
            {role === "admin" && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 pt-4">Class you teach</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stream</label>
                    <select
                      required
                      value={teachingStream}
                      onChange={(e) => setTeachingStream(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select stream</option>
                      {STREAMS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
                    <select
                      required
                      value={teachingSection}
                      onChange={(e) => setTeachingSection(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select section</option>
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

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