import React, { useEffect, useRef } from "react";

export default function Alerts({ user, alerts, setAlerts }) {
  const eventSourceRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      // Close any open stream if user logs out
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      setAlerts([]);
      return;
    }

    const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:5000";

    function connect() {
      console.log("🔗 Connecting to SSE stream...");

      const eventSource = new EventSource(`${apiBase}/alerts/stream`, {
        withCredentials: true, // requires backend CORS to allow cookies
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("✅ SSE connection opened");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Ignore system messages
          if (data.type === "ping" || data.type === "connected") return;

          setAlerts((prev) => [data, ...prev]);
        } catch (err) {
          console.warn("⚠️ Invalid SSE message:", event.data);
        }
      };

      eventSource.onerror = (err) => {
        console.error("❌ SSE error:", err);
        eventSource.close();

        // Retry after delay
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null;
            connect();
          }, 5000); // 5s backoff
        }
      };
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
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
