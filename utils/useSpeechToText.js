import { useEffect, useMemo, useRef, useState } from "react";

// Minimal Web Speech API wrapper (Chrome supports webkitSpeechRecognition)
export function useSpeechToText() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported] = useState(Boolean(SpeechRecognition));

  const api = useMemo(() => {
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    return rec;
  }, [SpeechRecognition]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return {
    supported,
    listening,
    transcript,
    setTranscript,
    start() {
      if (!api) return;
      setTranscript("");
      setListening(true);
      api.start();
    },
    stop() {
      if (!api) return;
      api.stop();
      setListening(false);
    }
  };
}

