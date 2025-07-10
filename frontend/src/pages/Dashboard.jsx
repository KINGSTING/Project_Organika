import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Dashboard.css"; // make sure this file exists and contains your styling

function Dashboard() {
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the Dashboard!");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";

  useEffect(() => {
    // Animate welcome message
    setTimeout(() => {
      setWelcomeMessage("📊 Dashboard Overview");
    }, 500);

    // Fetch analytics from backend
    axios.get(`${API_BASE}/api/dashboard-overview`)
      .then((res) => {
        console.log("[Dashboard] Fetched analytics:", res.data);
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard data fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="title">{welcomeMessage}</h2>

      {loading ? (
        <div className="text-muted">Loading data...</div>
      ) : analytics ? (
        <>
          <div className="summary-cards">
            <SummaryCard title="📁 Total Plantilla Items" value={analytics.total_items} delay={0} />
            <SummaryCard title="✅ Filled" value={analytics.filled} delay={1} />
            <SummaryCard title="🕳️ Vacant" value={analytics.vacant} delay={2} />
            <SummaryCard title="❄️ Frozen" value={analytics.frozen} delay={3} />
            <SummaryCard title="💰 Funded" value={analytics.funded} delay={4} />
            <SummaryCard title="🚫 Unfunded" value={analytics.unfunded} delay={5} />
          </div>

          <div className="office-section">
            <h3>📌 Plantilla by Office</h3>
            <ul>
              {analytics.by_office?.map((item, index) => (
                <li key={index}>
                  <strong>{item.office}</strong>: {item.count} items
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-muted">No data found.</div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, delay }) {
  return (
    <div
      className="summary-card"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default Dashboard;