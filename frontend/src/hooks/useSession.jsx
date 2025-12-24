import { useEffect, useState } from "react";

export default function useSession() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        // Reuse existing session if present
        const stored = localStorage.getItem("sessionId");
        if (stored) {
          setSessionId(stored);
          setLoading(false);
          return;
        }

        // Create new session on backend
        const res = await fetch("/api/session", {
          method: "POST",
        });

        const data = await res.json();
        localStorage.setItem("sessionId", data.sessionId);
        setSessionId(data.sessionId);
      } catch (err) {
        console.error("Session init failed", err);
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  const resetSession = async () => {
    localStorage.removeItem("sessionId");
    setSessionId(null);
  };

  return {
    sessionId,
    loading,
    resetSession,
  };
}
