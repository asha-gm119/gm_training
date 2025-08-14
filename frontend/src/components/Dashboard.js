import React, { useEffect, useState } from "react";
import { testRateLimit } from "../services/api";
import axiosInstance from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const [rateLimitColor, setRateLimitColor] = useState("black");
  const [dataSourceMessage, setDataSourceMessage] = useState(""); // New: data source message

  useEffect(() => {
    // Fetch analytics
    axiosInstance
      .get("/analytics")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));

    // SSE for live alerts
    const apiBaseNoApi = (process.env.REACT_APP_API_BASE || "http://localhost:5000/api")
      .replace("/api", "");
    const eventSource = new EventSource(`${apiBaseNoApi}/alerts/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (e) => {
      const alert = JSON.parse(e.data);
      setAlerts((prev) => [alert, ...prev]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => eventSource.close();
  }, []);

  const handleRateLimitTest = async () => {
    try {
      const res = await testRateLimit();
      setRateLimitMessage(res.message || "✅ Request successful");
      setRateLimitColor("green");
    } catch (err) {
      if (err.response?.status === 429) {
        setRateLimitMessage("🚫 You have hit the maximum number of API requests!");
        setRateLimitColor("red");
      } else {
        setRateLimitMessage("❌ Error testing rate limit");
        setRateLimitColor("red");
      }
    }
  };

  const handleAddUserClick = async () => {
    try {
      const res = await axiosInstance.get("/employees/check-source"); 
      // Backend should return { source: "redis" } or { source: "mongodb" }
      if (res.data.source === "redis") {
        setDataSourceMessage("Data Source: Redis Session Cache");
      } else if (res.data.source === "mongodb") {
        setDataSourceMessage("Data Source: MongoDB Database");
      } else {
        setDataSourceMessage("Data Source: Unknown");
      }
      window.location.href = "/add-user";
    } catch (err) {
      console.error("Failed to check data source:", err);
      setDataSourceMessage("Data Source Check Failed");
      window.location.href = "/add-user";
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
        
        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
          <h3> Caching</h3>
          <p>Store and retrieve employee list in Redis to reduce MongoDB load and improve performance.</p>
          <small>Currently used for employee list caching.</small>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
          <h3>🔄 Rate Limiting</h3>
          <p>Tracks the number of API hits per user/IP using Redis. Prevents abuse of the API.</p>
          <button onClick={handleRateLimitTest}>Test API Request</button>
          {rateLimitMessage && (
            <p style={{ marginTop: "10px", color: rateLimitColor }}>{rateLimitMessage}</p>
          )}
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
          <h3> Session Store</h3>
          <p>Persists login sessions in Redis across server restarts and deployments.</p>
          <button onClick={() => window.open("/login", "_blank")}>Open Login in New Tab</button>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
          <h3> Analytics</h3>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Employees: {stats.totalEmployees}</p>
          <p>Total Login Requests: {stats.totalLoginRequests}</p>
          <p>Total Requests: {stats.totalRequests}</p>
        </div>
      </div>

      {dataSourceMessage && (
        <p style={{ marginTop: "20px", color: "blue", fontWeight: "bold" }}>
          {dataSourceMessage}
        </p>
      )}

      <button onClick={handleAddUserClick}>
        Add User
      </button>
    
    </div>
  );
}
