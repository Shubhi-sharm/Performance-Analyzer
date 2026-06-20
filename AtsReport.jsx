import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import CircularScore from "../components/CircularScore.jsx";
import KeywordChips from "../components/KeywordChips.jsx";

export default function AtsReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/ats/reports/${id}`);
        setReport(data.report);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load ATS report");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
        {error}
      </div>
    );
  }
  if (!report) return <div className="text-slate-600 dark:text-slate-300">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ATS Report</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            {report.jobRole} · Match {report.matchPercent}%
          </p>
        </div>
        <Link className="underline text-sm" to="/ats">
          Back to ATS
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <CircularScore value={report.atsScore} label="ATS Score" />
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{report.summary}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeywordChips title="Matched keywords" items={report.matchedKeywords?.slice(0, 30)} variant="matched" />
        <KeywordChips title="Missing keywords" items={report.missingKeywords?.slice(0, 30)} variant="missing" />
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <div className="font-medium">Suggestions</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
          {(report.suggestions || []).map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
          {!report.suggestions?.length ? (
            <li className="text-slate-500 dark:text-slate-400">No suggestions</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

