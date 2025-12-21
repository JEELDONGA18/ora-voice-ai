import { useEffect, useState } from "react";

function generateSessionId() {
  return crypto.randomUUID();
}

export default function useSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const id = generateSessionId();
    setSessionId(id);
  }, []);

  return sessionId;
}