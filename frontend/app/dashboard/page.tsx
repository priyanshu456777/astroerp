"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";


interface Notice {
  _id: string;
  title: string;
  createdAt: string;
}

export default function DashboardHome() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const [tasksDue, setTasksDue] = useState<number | null>(null);
  const [attendancePct, setAttendancePct] = useState<number | null>(null);
  const [noticeCount, setNoticeCount] = useState<number | null>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);

  useEffect(() => {
    apiFetch("/tasks")
      .then((data) => {
        const pending = data.tasks.filter((t: any) => t.status !== "completed").length;
        setTasksDue(pending);
      })
      .catch(() => setTasksDue(0));

    apiFetch("/notices")
      .then((data) => {
        setNoticeCount(data.notices.length);
        setRecentNotices(data.notices.slice(0, 3));
      })
      .catch(() => {
        setNoticeCount(0);
        setRecentNotices([]);
      });

    if (!isAdmin) {
      apiFetch("/attendance/me")
        .then((data) => setAttendancePct(data.percentage))
        .catch(() => setAttendancePct(0));
    }
  }, [isAdmin]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const quickLinks = [
    { name: "Timetable", href: "/dashboard/timetable", icon: "calendar" },
    { name: "Tasks", href: "/dashboard/tasks", icon: "check" },
    { name: "Notes", href: "/dashboard/notes", icon: "note" },
    { name: "Shared Notes", href: "/dashboard/shared-notes", icon: "share" },
  ];

  const icons: Record<string, React.ReactElement> = {
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    check: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    note: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </svg>
    ),
    share: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>
    ),
  };

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-[#0B2530] to-[#123847] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full" />
        <div className="relative">
          <p className="text-emerald-300 text-sm font-medium">{today}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            {greeting}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            {isAdmin
              ? "Here's what's happening across campus today."
              : "Here's a quick look at your campus life today."}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Tasks Pending</p>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              {icons.check}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {tasksDue === null ? "..." : tasksDue}
          </p>
        </div>

        {!isAdmin && (
          <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Attendance</p>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  attendancePct !== null && attendancePct < 75
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {icons.calendar}
              </div>
            </div>
            <p
              className={`text-3xl font-bold mt-2 ${
                attendancePct !== null && attendancePct < 75 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {attendancePct === null ? "..." : `${attendancePct}%`}
            </p>
            {attendancePct !== null && attendancePct < 75 && (
              <p className="text-xs text-red-500 mt-1">Below 75% — keep an eye on this</p>
            )}
          </div>
        )}

        <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Notices</p>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              {icons.share}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {noticeCount === null ? "..." : noticeCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Access</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <span className="text-gray-400">{icons[link.icon]}</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Recent notices */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent Notices</h2>
            <a href="/dashboard/notices" className="text-xs text-emerald-600 font-medium hover:underline">
              View all
            </a>
          </div>
          {recentNotices.length === 0 ? (
            <p className="text-sm text-gray-500">No notices posted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice._id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}