import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/reports/${id}`);
        setReport(data.report);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load report");
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
  if (!report) return <div className="text-slate-600">Loading report...</div>;

  const s = report.overallScores || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Performance report</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{report.summary}</p>
        </div>
        <div className="text-sm bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-3 py-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Final verdict</div>
          <div className="font-semibold">{report.finalVerdict}</div>
        </div>
      </div>

      {(report.finalScore || report.atsScore || report.interviewScore) ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard label="Final Score" value={report.finalScore} />
          <ScoreCard label="Interview Score" value={report.interviewScore} />
          <ScoreCard label="ATS Score" value={report.atsScore} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreCard label="Clarity" value={s.clarity} />
        <ScoreCard label="Confidence" value={s.confidence} />
        <ScoreCard label="Grammar" value={s.grammar} />
        <ScoreCard label="Relevance" value={s.relevance} />
      </div>

      {report.missingSkills?.length ? (
        <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
          <div className="font-medium">Missing skills / keywords (from ATS)</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.missingSkills.map((k) => (
              <span
                key={k}
                className="text-xs bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-200 border rounded-full px-2 py-1"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ListCard title="Strengths" items={report.strengths} />
        <ListCard title="Weaknesses" items={report.weaknesses} />
        <ListCard title="Suggestions" items={report.suggestions} />
      </div>

      <div>
        <Link className="underline text-sm" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{Number(value ?? 0).toFixed(1)}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">out of 10</div>
    </div>
  );
}

function ListCard({ title, items }) {
  return (
    <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-4">
      <div className="font-medium">{title}</div>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
        {(items || []).length ? (
          items.map((x, idx) => <li key={idx}>{x}</li>)
        ) : (
          <li className="text-slate-500 dark:text-slate-400">No items</li>
        )}
      </ul>
    </div>
  );
}
