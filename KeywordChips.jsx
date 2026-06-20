import React from "react";

export default function KeywordChips({ title, items = [], variant = "matched" }) {
  const styles =
    variant === "missing"
      ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-200"
      : "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200";

  return (
    <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
      <div className="font-medium">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items?.length ? (
          items.map((k) => (
            <span key={k} className={`text-xs border rounded-full px-2 py-1 ${styles}`}>
              {k}
            </span>
          ))
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">No items</div>
        )}
      </div>
    </div>
  );
}

