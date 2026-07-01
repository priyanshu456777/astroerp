import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: "📅",
      title: "Smart Timetable",
      desc: "Admins publish class schedules instantly. Students always know what's next.",
    },
    {
      icon: "✅",
      title: "Task Management",
      desc: "Assign deadlines, track completion, and never miss a submission again.",
    },
    {
      icon: "📊",
      title: "Attendance Analytics",
      desc: "Subject-wise breakdown with live percentage graphs. Know your standing at a glance.",
    },
    {
      icon: "📢",
      title: "Notice Board",
      desc: "Campus announcements in one place. No WhatsApp chains, no missed updates.",
    },
    {
      icon: "📝",
      title: "Private Notes",
      desc: "Your personal space to save notes with file attachments. Fully private, always secure.",
    },
    {
      icon: "📚",
      title: "Shared Notes",
      desc: "Teachers upload subject-wise study material. Students access everything in one tab.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign up with your role",
      desc: "Students get instant access. Admin accounts go through a quick Super Admin approval for security.",
    },
    {
      number: "02",
      title: "Your dashboard, your data",
      desc: "Everything relevant to your role — timetable, tasks, attendance, notices — right on your dashboard.",
    },
    {
      number: "03",
      title: "Stay on top of campus life",
      desc: "Real-time updates, private notes, shared resources — everything you need, nothing you don't.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#0B2530]">AstroERP</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#0B2530] transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-[#0B2530] overflow-hidden pt-32 pb-24 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#123847]/50 rounded-full blur-3xl" />
        </div>

        {/* Floating stat pills */}
        <div className="absolute bottom-40 left-16 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium">
  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
  7 powerful modules
</div>
<div className="absolute bottom-24 right-16 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium">
  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
  Role-based access control
</div>
        <div className="absolute bottom-32 left-16 lg:left-32 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium animate-pulse" style={{animationDelay: "1s"}}>
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          Real-time attendance tracking
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Campus management, reimagined
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Everything your campus
            <span className="block text-emerald-400">needs in one place.</span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            AstroERP brings timetables, tasks, attendance, notices, and notes together — with smart role-based access for students and admins.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all border border-white/20"
            >
              Log in to dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="bg-[#123847] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400/60"></div>
              <div className="ml-4 flex-1 bg-white/10 rounded-md h-6 max-w-xs"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {["Tasks Pending", "Attendance", "Notices"].map((label, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-2">{label}</p>
                  <div className={`h-8 w-16 rounded-md ${i === 1 ? "bg-emerald-500/30" : "bg-white/10"}`}></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-white/40 text-xs mb-3">Quick Access</p>
                {["Timetable", "Tasks", "Notes", "Shared Notes"].map((item, i) => (
                  <div key={i} className="h-6 bg-white/10 rounded-md"></div>
                ))}
              </div>
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/40 text-xs mb-3">Recent Notices</p>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    <div className="h-4 bg-white/10 rounded-md flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2530]">Built for how campuses actually work</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Not a generic tool. Every module was designed around real student and admin workflows.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[#0B2530] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2530]">Up and running in minutes</h2>
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#0B2530] flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-lg">{step.number}</span>
                </div>
                <div className="pt-3">
                  <h3 className="font-semibold text-[#0B2530] text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#0B2530]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to bring your campus online?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join AstroERP today — free to use, easy to set up, built for real campuses.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/25 text-lg"
          >
            Create your account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071a23] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/40 text-sm font-semibold">AstroERP</span>
          <p className="text-white/30 text-xs">© 2026 AstroERP. Built for campus communities.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-white/40 hover:text-white/70 text-xs transition-colors">Login</Link>
            <Link href="/signup" className="text-white/40 hover:text-white/70 text-xs transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}