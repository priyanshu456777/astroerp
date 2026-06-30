"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser, saveAuth } from "@/lib/auth";

export default function ProfilePage() {
  const user = getStoredUser();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await apiFetch("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      const token = localStorage.getItem("accessToken") || "";
      saveAuth(token, data.user);
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    try {
      await apiFetch("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwError(err.message);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h2 className="font-semibold text-gray-900 mb-3">Account Info</h2>
        <p className="text-sm text-gray-500 mb-1">Email: {user?.email}</p>
        <p className="text-sm text-gray-500 mb-4">Role: {user?.role}</p>

        {message && <p className="text-sm text-emerald-600 mb-2">{message}</p>}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Save Name
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h2 className="font-semibold text-gray-900 mb-3">Change Password</h2>

        {pwMessage && <p className="text-sm text-emerald-600 mb-2">{pwMessage}</p>}
        {pwError && <p className="text-sm text-red-600 mb-2">{pwError}</p>}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            Change Password
          </button>
        </form>
      </div>

      {user?.role === "student" && user?.adminStatus !== "none" && (
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Admin Access Request</h2>
          <p className="text-sm text-gray-700">
            Status:{" "}
            <span
              className={
                user.adminStatus === "pending"
                  ? "text-amber-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {user.adminStatus}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}