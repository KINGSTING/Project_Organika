import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import "./styles/Dashboard.css";

function Dashboard() {
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the Dashboard!");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6B6B'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeMessage("📊 Dashboard Overview");
    }, 500);

    axios.get(`${API_BASE}/`)
      .then((res) => {
        console.log("[Dashboard] Analytics fetched:", res.data);
        setAnalytics(res.data);
      })
      .catch((err) => {
        console.error("[Dashboard] Failed to fetch analytics:", err);
        setAnalytics(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => clearTimeout(timer);
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
          </div>

          <div className="office-section">
            <h3>📌 Plantilla by Office</h3>
            {analytics.by_office.length > 0 ? (
              <ul>
                {analytics.by_office.map((item, index) => (
                  <li key={index}>
                    <strong>{item.office}</strong>: {item.count} items
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted">No office data available.</div>
            )}
          </div>

          <div className="pie-chart-section">
            <h3>📊 Distribution of Items by Office</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.by_office}
                  dataKey="count"
                  nameKey="office"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {analytics.by_office.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="text-muted">No data available.</div>
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
