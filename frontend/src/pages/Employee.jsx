// Fully updated Employee.jsx with UI fixes and consistent styling support
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Employee.css";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    position_title: "",
    employment_status: "",
    eligibility: "",
    photo_url: "",
    emblem_url: "",
    office: "",
    date_of_birth: "",
    original_appointment_date: "",
    last_promotion_date: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    office: "",
    employment_status: "",
    eligibility: ""
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const officeEmblems = {};
  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/employees/get_employee`, { withCredentials: true });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleSearch = () => {
    setFilteredEmployees(
      employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "office" && officeEmblems[value]) {
        updated.emblem_url = officeEmblems[value];
      }
      return updated;
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "office" && officeEmblems[value]) {
        updated.emblem_url = officeEmblems[value];
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo_url) {
      alert("Please upload a photo before submitting.");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/employees/create_employee`, formData, { withCredentials: true });
      setMessage(res.data.msg || "Employee added successfully!");
      setFormData({
        full_name: "",
        position_title: "",
        employment_status: "",
        eligibility: "",
        photo_url: "",
        emblem_url: "",
        office: "",
        date_of_birth: "",
        original_appointment_date: "",
        last_promotion_date: ""
      });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to add employee:", err);
      setMessage("Failed to add employee");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/employees/update_employee/${selectedEmployee.id}`, editFormData, { withCredentials: true });
      setEditMode(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`${API_BASE}/employees/delete_employee`, {
        data: { id: selectedEmployee.id },
        withCredentials: true,
      });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleImageUpload = async (e, key, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "employee_unsigned");
    try {
      setUploading(true);
      const res = await axios.post("https://api.cloudinary.com/v1_1/dzn6wdijk/image/upload", data);
      setter(prev => ({ ...prev, [key]: res.data.secure_url }));
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const openEdit = () => {
    setEditFormData(selectedEmployee);
    setEditMode(true);
  };

  return (
    <section className="employee-page">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button className="floating-add-btn" onClick={() => setShowForm(true)} title="Add Employee">➕</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            <h2 className="form-title">Add New Employee</h2>
            <form className="employee-form" onSubmit={handleSubmit}>
              {["full_name", "position_title", "employment_status", "eligibility"].map(field => (
                <div key={field} className="form-group">
                  <label>{field.replace(/_/g, ' ')}</label>
                  <input type="text" name={field} value={formData[field]} onChange={handleFormChange} required />
                </div>
              ))}
              {["date_of_birth", "original_appointment_date", "last_promotion_date"].map(field => (
                <div key={field} className="form-group">
                  <label>{field.replace(/_/g, ' ')}</label>
                  <input type="date" name={field} value={formData[field]} onChange={handleFormChange} />
                </div>
              ))}
              <div className="form-group">
                <label>Office or Department</label>
                <select name="office" value={formData.office} onChange={handleFormChange} required>
                  <option value="" disabled>Select an office</option>
                  {Object.keys(officeEmblems).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "photo_url", setFormData)} required />
                {formData.photo_url && <img src={formData.photo_url} alt="Preview" style={{ width: 100, marginTop: 10 }} />}
              </div>
              <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Submit"}</button>
              {message && <p className="form-message">{message}</p>}
            </form>
          </div>
        </div>
      )}

      <div className="employee-grid">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="employee-card" onClick={() => { setSelectedEmployee(emp); setEditMode(false); }}>
            <div className="image-wrapper">
              {emp.photo_url ? (
                <img src={emp.photo_url} alt={emp.full_name} className="employee-photo" />
              ) : (
                <div className="placeholder-photo"></div>
              )}
              {emp.emblem_url && <img src={emp.emblem_url} className="emblem" alt="Emblem" />}
            </div>
            <div className="employee-name">{emp.full_name}</div>
            <div className="employee-office">{emp.office}</div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="details-modal-overlay" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>
          <div className="details-modal-content" onClick={e => e.stopPropagation()}>
            <button className="details-modal-close" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>&times;</button>
            {editMode ? (
              <form className="details-edit-form" onSubmit={handleEditSubmit}>
                <h2>Edit Employee</h2>
                {["full_name", "position_title", "office", "employment_status", "eligibility", "date_of_birth", "original_appointment_date", "last_promotion_date"].map(field => (
                  <div key={field} className="form-group">
                    <label>{field.replace(/_/g, ' ')}</label>
                    <input type={field.includes("date") ? "date" : "text"} name={field} value={editFormData[field] || ""} onChange={handleEditChange} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Photo</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "photo_url", setEditFormData)} />
                  {editFormData.photo_url && <img src={editFormData.photo_url} alt="Preview" style={{ width: 100, marginTop: 10 }} />}
                </div>
                <button type="submit">Save</button>
              </form>
            ) : (
              <div>
                <img src={selectedEmployee.photo_url} alt={selectedEmployee.full_name} className="details-photo" />
                <h2>{selectedEmployee.full_name}</h2>
                <p><strong>Position:</strong> {selectedEmployee.position_title}</p>
                <p><strong>Office:</strong> {selectedEmployee.office}</p>
                <p><strong>Status:</strong> {selectedEmployee.employment_status}</p>
                <p><strong>Eligibility:</strong> {selectedEmployee.eligibility}</p>
                <p><strong>Date of Birth:</strong> {selectedEmployee.date_of_birth}</p>
                <p><strong>Original Appointment:</strong> {selectedEmployee.original_appointment_date}</p>
                <p><strong>Last Promotion:</strong> {selectedEmployee.last_promotion_date}</p>
                <div className="details-actions">
                  <button className="edit-btn" onClick={openEdit}>✏️ Edit</button>
                  <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Employee;
