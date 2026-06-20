import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import CircularScore from "../components/CircularScore.jsx";
import KeywordChips from "../components/KeywordChips.jsx";

const DOMAINS = ["HR", "TECHNICAL", "DSA", "SYSTEM_DESIGN", "BEHAVIORAL"];

export default function ATSPage() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const [jobRole, setJobRole] = useState("Software Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [domain, setDomain] = useState("TECHNICAL");
  const [mode, setMode] = useState("text");

  const [activeReport, setActiveReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const [r1, r2] = await Promise.all([api.get("/ats/resumes"), api.get("/ats/reports")]);
    setResumes(r1.data.resumes || []);
    setReports(r2.data.reports || []);
    if (!selectedResumeId && (r1.data.resumes || []).length) {
      setSelectedResumeId(r1.data.resumes[0]._id);
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedResume = useMemo(
    () => resumes.find((r) => r._id === selectedResumeId),
    [resumes, selectedResumeId]
  );

  async function upload() {
    if (!resumeFile) return;
    setError("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("resume", resumeFile);
      const { data } = await api.post("/ats/upload-resume", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await refresh();
      setSelectedResumeId(data.resume.id);
    } catch (e) {
      setError(e?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function analyze() {
    if (!selectedResumeId || !jobRole.trim() || !jobDescription.trim()) {
      setError("Please select a resume, job role, and paste a job description.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/ats/analyze-resume", {
        resumeId: selectedResumeId,
        jobRole,
        jobDescription
      });
      setActiveReport(data.report);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  async function startInterviewFromAts() {
    if (!selectedResumeId) return;
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/interviews", {
        domain,
        mode,
        resumeId: selectedResumeId,
        jobRole,
        jobDescription,
        atsReportId: activeReport?._id
      });
      navigate(`/interview/${data.interview._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to start interview");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ATS Analyzer</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Upload your resume, paste a job description, and get ATS score + missing keywords + tailored interview flow.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="font-medium">1) Upload resume (PDF/DOCX)</div>
          <input
            type="file"
            accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
          <button
            disabled={!resumeFile || busy}
            onClick={upload}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Working..." : "Upload"}
          </button>

          <div className="border-t dark:border-slate-800 pt-4">
            <div className="font-medium">2) Select resume</div>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="mt-2 w-full border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName || r._id} ({r.fileType}) — latest ATS: {r.latestAtsScore || 0}
                </option>
              ))}
            </select>
            {resumes.length === 0 ? (
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                No resumes uploaded yet.
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="font-medium">3) Job role + description</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">Job role</label>
              <input
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">Interview domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 w-full border dark:border-slate-800 rounded-lg px-3 py-2 text-sm"
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">Job description (paste)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="mt-1 w-full border dark:border-slate-800 rounded-xl p-3 text-sm"
              placeholder="Paste JD here..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              disabled={busy}
              onClick={analyze}
              className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {busy ? "Analyzing..." : "Get ATS score"}
            </button>
            <button
              disabled={busy || !activeReport}
              onClick={() => navigate(`/ats/report/${activeReport._id}`)}
              className="border dark:border-slate-800 rounded-lg px-4 py-2 text-sm"
            >
              Open report
            </button>
            <button
              disabled={busy || !selectedResumeId}
              onClick={startInterviewFromAts}
              className="border dark:border-slate-800 rounded-lg px-4 py-2 text-sm"
            >
              Start interview from ATS →
            </button>
          </div>

          {selectedResume ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Selected resume skills: {(selectedResume.parsedData?.skills || []).slice(0, 10).join(", ") || "—"}
            </div>
          ) : null}
        </div>
      </div>

      {activeReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
            <CircularScore value={activeReport.atsScore} label="ATS Score" />
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Match: <span className="font-semibold">{activeReport.matchPercent}%</span>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{activeReport.summary}</div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <KeywordChips title="Matched keywords" items={activeReport.matchedKeywords?.slice(0, 20)} variant="matched" />
            <KeywordChips title="Missing keywords" items={activeReport.missingKeywords?.slice(0, 20)} variant="missing" />
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
            <div className="font-medium">Suggestions</div>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-200 space-y-1">
              {(activeReport.suggestions || []).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
              {!activeReport.suggestions?.length ? <li className="text-slate-500 dark:text-slate-400">No suggestions</li> : null}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">ATS report history</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Your latest ATS reports.</div>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2">Role</th>
                <th className="py-2">ATS</th>
                <th className="py-2">Match</th>
                <th className="py-2">Date</th>
                <th className="py-2">Open</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 12).map((r) => (
                <tr key={r._id} className="border-t dark:border-slate-800">
                  <td className="py-2">{r.jobRole}</td>
                  <td className="py-2 font-semibold">{r.atsScore}</td>
                  <td className="py-2">{r.matchPercent}%</td>
                  <td className="py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">
                    <button className="underline" onClick={() => navigate(`/ats/report/${r._id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-500 dark:text-slate-400" colSpan={5}>
                    No ATS reports yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

