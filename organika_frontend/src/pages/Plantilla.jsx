import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Plantilla.css";

function Plantilla() {
  const [formData, setFormData] = useState({
    item_code: "",
    position_title: "",
    salary_grade: "",
    office: "",
    status: "",
    funding_status: "",
    employee_id: "",
  });

  const [message, setMessage] = useState("");
  const [plantillaItems, setPlantillaItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary_grade: parseInt(formData.salary_grade),
        employee_id: formData.employee_id || null,
      };

      const res = await axios.post(
        "http://localhost:5000/plantilla/create_plantilla_item",
        payload,
        { withCredentials: true }
      );

      setMessage(res.data.msg);
      setFormData({
        item_code: "",
        position_title: "",
        salary_grade: "",
        office: "",
        status: "",
        funding_status: "",
        employee_id: "",
      });
      fetchItems();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error
          ? "Error: " + err.response.data.error
          : "An unknown error occurred."
      );
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/plantilla", {
        withCredentials: true,
      });
      setPlantillaItems(res.data);
    } catch (err) {
      console.error("Failed to fetch plantilla items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="plantilla-section">
      <div className="plantilla-table-container">
        <h2 className="table-heading">📄 Plantilla Items</h2>
        <table className="plantilla-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Position Title</th>
              <th>Salary Grade</th>
              <th>Office/Department</th>
              <th>Funding Status</th>
              <th>Employee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plantillaItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No records found.
                </td>
              </tr>
            ) : (
              plantillaItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_code}</td>
                  <td>{item.position_title}</td>
                  <td>{item.salary_grade}</td>
                  <td>{item.office}</td>
                  <td>{item.funding_status}</td>
                  <td>{item.employee_id ?? "—"}</td>
                  <td>
                    <button className="edit-btn">✏️</button>
                    <button className="delete-btn">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button
        className="floating-add-btn"
        onClick={() => setShowForm(true)}
        title="Add Plantilla Item"
      >➕
      </button>

     {showForm && (
      <div className="modal-overlay" onClick={() => setShowForm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* ❌ Close Button */}
          <button className="modal-close" onClick={() => setShowForm(false)}>
            ❌
          </button>

          <h2 className="form-title">➕ Add New Plantilla Item</h2>
          <form onSubmit={handleSubmit} className="plantilla-form">
            {[
              ["item_code", "Item Code"],
              ["position_title", "Position Title"],
              ["salary_grade", "Salary Grade"],
              ["office", "Office"],
              ["status", "Status"],
              ["funding_status", "Funding Status"],
              ["employee_id", "Employee ID (optional)"],
            ].map(([name, label]) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "employee_id"}
                />
              </div>
            ))}
            <div className="form-footer">
              <button type="submit">Submit</button>
            </div>
          </form>
          {message && <div className="form-message">{message}</div>}
        </div>
      </div>
    )}
    </section>
  );
}

export default Plantilla;
