import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useSpeechToText } from "../utils/useSpeechToText";

function msToPretty(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const startRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  const stt = useSpeechToText();

  const currentTurn = useMemo(() => {
    const turns = interview?.turns || [];
    return turns[turns.length - 1] || null;
  }, [interview]);

  const answeredCount = useMemo(() => {
    const turns = interview?.turns || [];
    return turns.filter((t) => (t.answer || "").trim()).length;
  }, [interview]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        setInterview(data.interview);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load interview");
      }
    })();
  }, [id]);

  // Timer for response time tracking
  useEffect(() => {
    if (!currentTurn) return;
    startRef.current = Date.now();
    setElapsed(0);
    const t = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 250);
    return () => clearInterval(t);
  }, [currentTurn?.question]);

  // If voice mode, keep textarea updated from transcript
  useEffect(() => {
    if (interview?.mode !== "voice") return;
    if (!stt.transcript) return;
    setAnswer(stt.transcript);
  }, [stt.transcript, interview?.mode]);

  function speakQuestion() {
    const text = currentTurn?.question;
    if (!text) return;
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  async function submit() {
    if (!answer.trim()) return;
    if (interview?.status === "completed") return;
    setError("");
    setBusy(true);
    setMetrics(null);

    const responseTimeMs = Math.max(0, Date.now() - (startRef.current || Date.now()));
    try {
      const { data } = await api.post(`/interviews/${id}/answer`, { answer, responseTimeMs });
      setInterview(data.interview);
      setMetrics(data.metrics);
      setAnswer("");
      stt.setTranscript?.("");

      if (data.done) {
        // Generate report, then route
        const rep = await api.post(`/interviews/${id}/report`);
        navigate(`/report/${rep.data.report._id}`);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit answer");
    } finally {
      setBusy(false);
    }
  }

  if (!interview) {
    return <div className="text-slate-600">Loading interview...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Live Interview</h1>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Domain: <span className="font-medium">{interview.domain}</span> · Mode:{" "}
            <span className="font-medium">{interview.mode}</span> · Progress:{" "}
            <span className="font-medium">
              {answeredCount}/{interview.maxQuestions}
            </span>
          </div>
        </div>
        <div className="text-sm bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-3 py-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">Response time</div>
          <div className="font-semibold">{msToPretty(elapsed)}</div>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
          {error}
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <div className="text-xs text-slate-500 dark:text-slate-400">Question</div>
        <div className="mt-2 text-lg font-medium">{currentTurn?.question}</div>
        {interview.status === "completed" ? (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This interview is completed. You can view (or generate) the final report.
            <div className="mt-2">
              <button
                onClick={async () => {
                  try {
                    const rep = await api.post(`/interviews/${id}/report`);
                    navigate(`/report/${rep.data.report._id}`);
                  } catch (e) {
                    setError(e?.response?.data?.message || "Failed to open report");
                  }
                }}
                className="text-sm bg-slate-900 text-white rounded-lg px-3 py-2"
              >
                View report
              </button>
            </div>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={speakQuestion}
            className="text-sm border rounded-lg px-3 py-2 bg-slate-50 hover:bg-slate-100"
          >
            Speak question
          </button>
          {interview.mode === "voice" ? (
            <>
              <button
                disabled={!stt.supported || stt.listening}
                onClick={stt.start}
                className="text-sm border rounded-lg px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-60"
              >
                Start voice input
              </button>
              <button
                disabled={!stt.supported || !stt.listening}
                onClick={stt.stop}
                className="text-sm border rounded-lg px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-60"
              >
                Stop
              </button>
              {!stt.supported ? (
                <div className="text-xs text-slate-500">
                  Voice input not supported in this browser.
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
        <div className="text-xs text-slate-500 dark:text-slate-400">Your answer</div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          className="mt-2 w-full border dark:border-slate-800 rounded-xl p-3"
          placeholder="Type your answer here..."
          disabled={interview.status === "completed"}
        />
        <div className="mt-3 flex gap-3">
          <button
            disabled={busy || !answer.trim() || interview.status === "completed"}
            onClick={submit}
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {busy ? "Submitting..." : "Submit answer"}
          </button>
          <button
            disabled={busy}
            onClick={() => setAnswer("")}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            Clear
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Tip: aim for structured answers (STAR) and quantify impact.
        </div>
      </div>

      {metrics ? (
        <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-5">
          <div className="font-medium">Instant feedback</div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Score label="Clarity" value={metrics.clarityScore} />
            <Score label="Confidence" value={metrics.confidenceScore} />
            <Score label="Grammar" value={metrics.grammarScore} />
            <Score label="Relevance" value={metrics.relevanceScore} />
          </div>
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">{metrics.feedback}</div>
          {metrics.improvementTips?.length ? (
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-200">
              {metrics.improvementTips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Score({ label, value }) {
  return (
    <div className="border dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-xl font-semibold">{Number(value ?? 0).toFixed(1)}</div>
    </div>
  );
}
