import { useEffect, useState } from "react";

export default function useSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Try to restore session
    let id = sessionStorage.getItem("ora_session_id");

    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("ora_session_id", id);
    }

    setSessionId(id);
  }, []);

  const resetSession = () => {
    const id = crypto.randomUUID();
    sessionStorage.setItem("ora_session_id", id);
    setSessionId(id);
  };

  return {
    sessionId,
    resetSession,
  };
}