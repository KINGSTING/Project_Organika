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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "https://your-backend.onrender.com";


  const fetchItems = async () => {
    try {
      const res = axios.get("${API_BASE}/plantilla/plantilla", {
        withCredentials: true,
      });
      setPlantillaItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Failed to fetch plantilla items:", err);
    }
  };

  const handleSearch = () => {
    const filtered = plantillaItems.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredItems(filtered);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary_grade: parseInt(formData.salary_grade),
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
      };

      let res;
      if (editMode && editItemId) {
        res = await axios.put(
          "${API_BASE}/plantilla/update_plantilla_item/${editItemId}",
          payload,
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          "${API_BASE}/plantilla/create_plantilla_item",
          payload,
          { withCredentials: true }
        );
      }

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
      setShowForm(false);
      setEditMode(false);
      setEditItemId(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error
          ? "Error: " + err.response.data.error
          : "An unknown error occurred."
      );
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      item_code: item.item_code,
      position_title: item.position_title,
      salary_grade: item.salary_grade.toString(),
      office: item.office,
      status: item.status,
      funding_status: item.funding_status,
      employee_id: item.employee_id?.toString() || "",
    });
    setEditItemId(item.id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (item) => {
    if (!window.confirm(`Are you sure you want to delete item ${item.item_code}?`)) {
      return;
    }

    try {
      const res = await axios.delete(
        "${API_BASE}/plantilla//delete_plantilla_item/${item.id}",
        { withCredentials: true }
      );

      setMessage(res.data.msg);
      fetchItems();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error
          ? "Error: " + err.response.data.error
          : "An unknown error occurred while deleting."
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="plantilla-section">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search plantilla..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>

      {/* Table */}
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
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No records found.</td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_code}</td>
                  <td>{item.position_title}</td>
                  <td>{item.salary_grade}</td>
                  <td>{item.office}</td>
                  <td>{item.funding_status}</td>
                  <td>{item.employee_name || "Vacant"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(item)}>🗑️</button>
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
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({
            item_code: "",
            position_title: "",
            salary_grade: "",
            office: "",
            status: "",
            funding_status: "",
            employee_id: "",
          });
        }}
        title="Add Plantilla Item"
      >
        ➕
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              ❌
            </button>
            <h2 className="form-title">
              {editMode ? "✏️ Edit Plantilla Item" : "➕ Add New Plantilla Item"}
            </h2>
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
                <button type="submit">{editMode ? "Update" : "Submit"}</button>
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
