"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, clearAuth } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.push("/login");
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Timetable", href: "/dashboard/timetable" },
    { name: "Tasks", href: "/dashboard/tasks" },
    { name: "Assignments", href: "/dashboard/assignments" },
    { name: "Attendance", href: "/dashboard/attendance" },
    { name: "Notices", href: "/dashboard/notices" },
    { name: "Notes", href: "/dashboard/notes" },
    { name: "Shared Notes", href: "/dashboard/shared-notes" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  const SUPER_ADMIN_EMAIL = "priyanshu456sh3@gmail.com";
  if (user.email === SUPER_ADMIN_EMAIL) {
    navItems.push({ name: "Admin Requests", href: "/dashboard/admin-requests" });
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-[#0B2530] text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold">AstroERP</h1>
          <p className="text-xs text-white/60 mt-1">
            {user.name} - {user.role}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a key={item.href} href={item.href} className={active ? "block px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white" : "block px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10"}>
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-white/10">
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {user.adminStatus === "pending" && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-md">
            Your admin access request is pending approval.
          </div>
        )}
        {user.adminStatus === "rejected" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            Your admin access request was rejected.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}