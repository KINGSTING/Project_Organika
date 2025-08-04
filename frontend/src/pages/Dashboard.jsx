import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer as ResponsivePie
} from "recharts";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import axios from "axios";
import "./styles/Dashboard.css";

function Dashboard() {
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the Dashboard!");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6B6B'];

  const openModal = async (title) => {
    setModalTitle(title);
    setModalOpen(true);
    setModalLoading(true);
    try {
      const status = title.toLowerCase().split(" ")[0]; // extract status (e.g., "Permanent")
      const res = await axios.get(`${API_BASE}/employees/${status}`);
      setModalData(res.data);
    } catch (err) {
      setModalData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalData([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setWelcomeMessage("📊 Dashboard Overview"), 500);

    axios.get(`${API_BASE}/`)
      .then(res => setAnalytics(res.data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="text-muted">Loading data...</div>;
  if (!analytics) return <div className="text-muted">No data available.</div>;

  return (
    <>
      <div className="dashboard-container">
        <h2 className="title">{welcomeMessage}</h2>

        <div className="summary-cards">
          <SummaryCard title="📁 Total Plantilla Items" value={analytics.total_items} delay={0} />
          <SummaryCard title="👨‍💼 Employed" value={analytics.total_employed} onClick={() => openModal("Employed")} />
          <SummaryCard title="🧑‍⚖️ Elected Officials" value={analytics.total_elected} onClick={() => openModal("Elected")} />
          <SummaryCard title="👩‍💼 Permanent" value={analytics.total_permanent} onClick={() => openModal("Permanent")} />
          <SummaryCard title="🔒 Conterminous" value={analytics.total_conterminous} onClick={() => openModal("Conterminous")} />
          <SummaryCard title="📄 Temporary" value={analytics.total_temporary} onClick={() => openModal("Temporary")} />
        </div>

        <section className="office-section">
          <h3>📌 Plantilla by Office</h3>
          {analytics.by_office.length > 0 ? (
            <ul>
              {analytics.by_office.map((item, i) => (
                <li key={i}>
                  <strong>{item.office}</strong>: {item.count} items
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted">No office data available.</div>
          )}
        </section>

        <section className="pie-chart-section">
          <h3>📊 Distribution of Items by Office</h3>
          <ResponsivePie width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.by_office}
                dataKey="count"
                nameKey="office"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.by_office.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
              <PieLegend />
            </PieChart>
          </ResponsivePie>
        </section>

        <section className="bar-chart-section">
          <h3>📊 Vacancies by Salary Grade</h3>
          {analytics.vacancy_by_grade.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics.vacancy_by_grade}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="salary_grade" label={{ value: "Salary Grade", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Vacancies", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="vacancies" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted">No vacancy data available.</div>
          )}
        </section>
      </div>

      {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{modalTitle} Details</h2>

              {modalLoading ? (
                <p>Loading...</p>
              ) : modalData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.map((emp, idx) => (
                      <tr key={idx}>
                        <td>{emp.full_name}</td>
                        <td>{emp.position_title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data available for this category.</p>
              )}

              <button onClick={closeModal}>Close</button>
            </div>
          </div>
     )}
    </>
  );
}

function SummaryCard({ title, value, delay = 0, onClick }) {
  return (
    <div
      className="summary-card"
      style={{ animationDelay: `${delay * 0.1}s` }}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default Dashboard;
