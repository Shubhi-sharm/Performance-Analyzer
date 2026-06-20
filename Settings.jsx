import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Customize your experience.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5 space-y-5">
        <div>
          <div className="font-medium">Theme</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Switch between light and dark mode.
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setTheme("dark")}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === "dark"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`px-3 py-2 rounded-lg border text-sm ${
                theme === "light"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
              }`}
            >
              Light
            </button>
          </div>
        </div>

        <div className="border-t dark:border-slate-800 pt-5">
          <div className="font-medium">Language (beta)</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Simple UI label translations (more strings can be added).
          </div>
          <div className="mt-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

