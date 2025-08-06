// Plantilla.jsx — Fully completed with table and modal logic
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Plantilla.css";

function Plantilla({ setShowModal, user }) {
  const [formData, setFormData] = useState({
    item_code: "",
    position_title: "",
    salary_grade: "",
    office: "",
    step: "",
    annual_salary_authorized: "",
    annual_salary_actual: "",
    employee_id: "",
  });

  const [plantillaItems, setPlantillaItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ office: "", salary_grade: "" });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";
  const officeList = [
    "Sangguniang Bayan",
    "General Services Office",
    "Municipal Treasury Office",
    "Municipal Civil Registrar Office",
    "Municipal Health Office",
    "Municipal Mayor's Office",
    "Municipal Planning and Development Office",
    "Municipal Budget Office",
    "Municipal Assessor's Office",
    "Municipal Agriculture's Office",
    "Public Employment Services Office",
    "Municipal Accounting",
    "Municipal Engineering Office",
    "Legal Services Office",
    "Municipal Environment and Natural Resources Office",
    "Municipal Human Resource Management and Development Office",
    "Secretary To the Sangguniang Bayan Office",
    "Municipal Economic Enterprise and Development Office",
    "Municipal Social Welfare and Development Office",
    "Municipal Disaster Risk and Reduction and Management Office"
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);


  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/plantilla/plantilla`, { withCredentials: true });
      setPlantillaItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Failed to fetch plantilla items:", err);
    } finally {
      setLoading(false);
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

  const handleEditClick = (item) => {
    setFormData({
      item_code: item.item_code,
      position_title: item.position_title,
      salary_grade: item.salary_grade.toString(),
      office: item.office,
      step: item.step?.toString() || "",
      annual_salary_authorized: item.annual_salary_authorized?.toString() || "",
      annual_salary_actual: item.annual_salary_actual?.toString() || "",
      employee_id: item.employee_id?.toString() || "",
    });
    setEditItemId(item.id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (item) => {
    if (!window.confirm(`Are you sure you want to delete item ${item.item_code}?`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/plantilla/delete_plantilla_item/${item.id}`, {
        withCredentials: true,
      });
      setFeedback({ message: res.data.msg || "Item deleted.", type: "success" });
      fetchItems();
    } catch (err) {
      console.error(err);
      setFeedback({ message: "An unknown error occurred while deleting.", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ message: "", type: "" });

    try {
      const payload = {
        ...formData,
        salary_grade: parseInt(formData.salary_grade),
        step: parseInt(formData.step),
        annual_salary_authorized: parseFloat(formData.annual_salary_authorized),
        annual_salary_actual: parseFloat(formData.annual_salary_actual),
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
      };

      let res;
      if (editMode && editItemId) {
        res = await axios.put(`${API_BASE}/plantilla/update_plantilla_item/${editItemId}`, payload, {
          withCredentials: true,
        });
        setFeedback({ message: "Plantilla item updated successfully.", type: "success" });
      } else {
        res = await axios.post(`${API_BASE}/plantilla/create_plantilla_item`, payload, {
          withCredentials: true,
        });
        setFeedback({ message: "New plantilla item added successfully.", type: "success" });
      }

      setFormData({
        item_code: "",
        position_title: "",
        salary_grade: "",
        office: "",
        step: "",
        annual_salary_authorized: "",
        annual_salary_actual: "",
        employee_id: "",
      });

      setShowForm(false);
      setEditMode(false);
      setEditItemId(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      setFeedback({ message: "An error occurred while submitting the form.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const applyFilters = () => {
    const filtered = plantillaItems.filter((item) => {
      return (!filters.office || item.office === filters.office)
        && (!filters.salary_grade || item.salary_grade.toString() === filters.salary_grade)
        && item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredItems(filtered);
    setShowFilterMenu(false);
  };

  return (
    <section className="plantilla-section">
      {feedback.message && (
        <div className={`feedback-banner ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {/* Search & Filter */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search plantilla..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>🔍 Search</button>

        <div className="filter-dropdown-wrapper">
          <button
            className="filter-toggle-button"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            🧮 Filter
          </button>

          {showFilterMenu && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Office/Department</label>
                <select
                  value={filters.office}
                  onChange={(e) => setFilters({ ...filters, office: e.target.value })}
                >
                  <option value="">All</option>
                  {[...new Set(plantillaItems.map((i) => i.office))].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Salary Grade</label>
                <select
                  value={filters.salary_grade}
                  onChange={(e) => setFilters({ ...filters, salary_grade: e.target.value })}
                >
                  <option value="">All</option>
                  {[...new Set(plantillaItems.map((i) => i.salary_grade))].sort((a, b) => a - b).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button className="apply-filter-btn" onClick={applyFilters}>
                ✅ Apply Filters
              </button>

              <button
                className="apply-filter-btn"
                style={{ marginTop: "0.5rem", backgroundColor: "#999" }}
                onClick={() => {
                  setFilters({ office: "", salary_grade: "" });
                  setFilteredItems(plantillaItems);
                  setShowFilterMenu(false);
                }}
              >
                🔄 Reset
              </button>
            </div>
          )}
        </div>
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
              <th>Office</th>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Loading Plantilla Items...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan="6">No records found.</td></tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} onClick={() => {
                  setSelectedItem(item);
                  setShowDetailModal(true);
                }}>
                  <td>{item.item_code}</td>
                  <td>{item.position_title}</td>
                  <td>{item.salary_grade}</td>
                  <td>{item.office}</td>
                  <td>{item.employee_name || "Vacant"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="modal-overlay-plantilla" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetailModal(false)}>❌</button>
            <h2>📄 Plantilla Item Detail</h2>
            <ul>
              <li><strong>Item Code:</strong> {selectedItem.item_code}</li>
              <li><strong>Position Title:</strong> {selectedItem.position_title}</li>
              <li><strong>Salary Grade:</strong> {selectedItem.salary_grade}</li>
              <li><strong>Step:</strong> {selectedItem.step}</li>
              <li><strong>Office:</strong> {selectedItem.office}</li>
              <li><strong>Annual Salary (Authorized):</strong> {selectedItem.annual_salary_authorized}</li>
              <li><strong>Annual Salary (Actual):</strong> {selectedItem.annual_salary_actual}</li>
              <li><strong>Employee:</strong> {selectedItem.employee_name || "Vacant"}</li>
            </ul>
            {user && (
              <div className="form-footer">
                  {console.log('user in Plantilla:', user)}
                <button onClick={() => {
                  handleEditClick(selectedItem);
                  setShowDetailModal(false);
                }}>✏️ Edit</button>
                <button onClick={() => {
                  handleDeleteClick(selectedItem);
                  setShowDetailModal(false);
                }}>🗑️ Delete</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Add Button */}
       {user && (
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
                step: "",
                annual_salary_authorized: "",
                annual_salary_actual: "",
                employee_id: "",
              });
            }}
          >
            ➕
          </button>
        )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>❌</button>
            <h2>{editMode ? "✏️ Edit Plantilla Item" : "➕ Add New Plantilla Item"}</h2>
            <form onSubmit={handleSubmit} className="plantilla-form">
              <div className="form-group">
                <label>Item Code</label>
                <input
                  type="text"
                  name="item_code"
                  value={formData.item_code}
                  onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position Title</label>
                <input
                  type="text"
                  name="position_title"
                  value={formData.position_title}
                  onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary Grade</label>
                <input
                  type="number"
                  name="salary_grade"
                  value={formData.salary_grade}
                  onChange={(e) => setFormData({ ...formData, salary_grade: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Office</label>
                <select
                  name="office"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  required
                >
                  <option value="">Select an office</option>
                  {officeList.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Step</label>
                <input
                  type="number"
                  name="step"
                  value={formData.step}
                  onChange={(e) => setFormData({ ...formData, step: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Annual Salary (Authorized)</label>
                <input
                  type="number"
                  name="annual_salary_authorized"
                  value={formData.annual_salary_authorized}
                  onChange={(e) => setFormData({ ...formData, annual_salary_authorized: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Annual Salary (Actual)</label>
                <input
                  type="number"
                  name="annual_salary_actual"
                  value={formData.annual_salary_actual}
                  onChange={(e) => setFormData({ ...formData, annual_salary_actual: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="number"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                />
              </div>

              <div className="form-footer">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : editMode ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Plantilla;
