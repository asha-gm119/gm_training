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

    // Create SSE connection only if logged in
    const eventSource = new EventSource("http://localhost:5000/api/alerts/stream", {
      withCredentials: true
    });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      if (newAlert.type === "ping") return;
      setAlerts((prev) => [newAlert, ...prev]);
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
