import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Your account details.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={user?.name || "—"} />
          <Field label="Email" value={user?.email || "—"} />
          <Field label="User ID" value={user?._id || user?.id || "—"} />
          <Field label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"} />
        </div>
        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Note: Profile editing can be added next (name, password, etc.).
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-medium break-all">{value}</div>
    </div>
  );
}

