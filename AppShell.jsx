import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, FileText, LogOut, Moon, PlayCircle, Settings, User, FileSearch } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import clsx from "clsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

const nav = [
  { to: "/dashboard", key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/start", key: "startInterview", label: "Start Interview", icon: PlayCircle },
  { to: "/ats", key: "ats", label: "ATS", icon: FileSearch },
  { to: "/history", key: "history", label: "History", icon: FileText },
  { to: "/profile", key: "profile", label: "Profile", icon: User },
  { to: "/settings", key: "settings", label: "Settings", icon: Settings }
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle, theme } = useTheme();
  const { t } = useI18n();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="bg-white dark:bg-slate-950 border-b lg:border-b-0 lg:border-r dark:border-slate-800">
        <div className="p-5 flex items-center justify-between">
          <Link to="/dashboard" className="font-semibold">
            Interview Analyzer
          </Link>
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
            title="Toggle theme"
          >
            <Moon className="w-4 h-4" />
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Signed in as</div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</div>
          </div>
        </div>
        <nav className="px-2 pb-6">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {t(item.key) || item.label}
              </NavLink>
            );
          })}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </button>
        </nav>
      </aside>
      <main className="p-4 lg:p-8">{children}</main>
    </div>
  );
}
