"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface AdminRequest {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string };
  status: "pending" | "approved" | "rejected";
  reason: string;
  createdAt: string;
}

export default function AdminRequestsPage() {
  const user = getStoredUser();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      const data = await apiFetch("/admin-requests");
      setRequests(data.requests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id: string, decision: "approved" | "rejected") => {
    try {
      await apiFetch(`/admin-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      });
      loadRequests();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const SUPER_ADMIN_EMAIL = "priyanshu456sh3@gmail.com";
  if (user?.email !== SUPER_ADMIN_EMAIL) {
    return <p className="text-gray-500">You don't have permission to view this page.</p>;
  }

  const statusColor = (status: string) => {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Access Requests</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{req.userId?.name}</p>
                <p className="text-xs text-gray-500">{req.userId?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Requested on {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(req.status)}`}>
                  {req.status}
                </span>

                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleDecision(req._id, "approved")}
                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, "rejected")}
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}