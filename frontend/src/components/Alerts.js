import React, { useEffect, useRef } from "react";

export default function Alerts({ user, alerts, setAlerts }) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!user) {
      // Close stream if logged out
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setAlerts([]);
      return;
    }

    // Use API base from env (fallback to localhost)
    const apiBase =
      process.env.REACT_APP_API_BASE || "http://localhost:5000";

    const eventSource = new EventSource(`${apiBase}/alerts/stream`, {
      withCredentials: true,
    });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        if (newAlert.type === "ping") return; // ignore heartbeats
        setAlerts((prev) => [newAlert, ...prev]);
      } catch (err) {
        console.warn("Invalid SSE message:", event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user, setAlerts]);

  if (!user) return null;

  return (
    <div>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            <strong>{alert.type}</strong> - {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
