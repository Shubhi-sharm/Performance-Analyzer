import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

const DOMAINS = [
  { value: "HR", label: "HR" },
  { value: "DSA", label: "DSA" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" }
];

export default function StartInterviewPage() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState("HR");
  const [mode, setMode] = useState("text");
  const [maxQuestions, setMaxQuestions] = useState(8);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canParse = useMemo(() => Boolean(resumeFile), [resumeFile]);

  async function parseResume() {
    if (!resumeFile) return;
    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("resume", resumeFile);
      const { data } = await api.post("/resume/parse", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResumeSkills(data.resume.skills || []);
      setResumeText(data.resume.rawText || "");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to parse resume");
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/interviews", {
        domain,
        mode,
        maxQuestions,
        resumeSkills,
        resumeText
      });
      navigate(`/interview/${data.interview._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to start interview");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Start interview</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Choose a domain, then answer questions step-by-step. You’ll receive AI feedback per answer
          and a final report.
        </p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
          {error}
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
            >
              {DOMAINS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
            >
              <option value="text">Text</option>
              <option value="voice">Voice (Web Speech API)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Max questions</label>
            <input
              type="number"
              min={3}
              max={20}
              value={maxQuestions}
              onChange={(e) => setMaxQuestions(Number(e.target.value))}
              className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="border-t dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Resume-based questioning (optional)</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Upload a PDF resume to extract skills and tailor questions.
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            <button
              disabled={!canParse || busy}
              onClick={parseResume}
              className="bg-slate-100 hover:bg-slate-200 border rounded-lg px-3 py-2 text-sm disabled:opacity-60"
            >
              Parse resume
            </button>
          </div>

          {resumeSkills.length ? (
            <div className="mt-3 text-sm">
              <div className="text-slate-500 dark:text-slate-400">Detected skills</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {resumeSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 rounded-full px-2 py-1"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              If OpenAI is not configured, skill extraction may return an empty list.
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={start}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Starting..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
