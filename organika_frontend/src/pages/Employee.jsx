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
    eligibility: "",
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const officeEmblems = {
    "Sangguniang Bayan": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896048/KAUSWAGAN-SB-LOGO-150x150_cbsnu6.png",
    "General Services Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/GSO-logo-02-150x150_tmeknk.png",
    "Municipal Treasury Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/uswag-Panudlanan-Profile-150x150_uvgdjh.png",
    "Municipal Civil Registrar Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/Lgu-kauswagan-civil-registrar-logo_kqopdu.jpg",
    "Municipal Health Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/lgu-kauswagan-health-office-logo_ebmuzm.png",
    "Municipal Mayor's Offce": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Planning and Development Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Budget Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Assessor's Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Agriculture's Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Public Employment Services Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Accounting": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Engineering Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Legal Services Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Environment and Natural Resources Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Human Resource Management and Development Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Secretary To the Sangguniang Bayan Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Economic Enterprise and Development Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Social Welfare and Development Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    "Municipal Disaster Risk and Reduction and Management Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png"
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees/get_employee", { withCredentials: true });
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
      const res = await axios.post("http://localhost:5000/employees/create_employee", formData, { withCredentials: true });
      setMessage(res.data.msg || "Employee added successfully!");
      setFormData({
        full_name: "",
        position_title: "",
        employment_status: "",
        eligibility: "",
        photo_url: "",
        emblem_url: "",
        office: "",
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
      await axios.put(
        `http://localhost:5000/employees/update_employee/${selectedEmployee.id}`,
        editFormData,
        { withCredentials: true }
      );
      setEditMode(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) { console.error("Update failed:", err); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete("http://localhost:5000/employees/delete_employee", {
        data: { id: selectedEmployee.id },
        withCredentials: true,
      });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) { console.error("Delete failed:", err); }
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

  const openEdit = () => { setEditFormData(selectedEmployee); setEditMode(true); };

  return (
    <section className="employee-page">
        {/* Employee Search and Filter */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <div className="filter-dropdown-wrapper">
          <button className="filter-toggle-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>🧰 Filter</button>
          {showFilterMenu && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Office</label>
                <select value={filters.office} onChange={e => setFilters({ ...filters, office: e.target.value })}>
                  <option value="">All</option>
                  {[...new Set(employees.map(e => e.office))].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Employment Status</label>
                <select value={filters.employment_status} onChange={e => setFilters({ ...filters, employment_status: e.target.value })}>
                  <option value="">All</option>
                  {[...new Set(employees.map(e => e.employment_status))].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Eligibility</label>
                <select value={filters.eligibility} onChange={e => setFilters({ ...filters, eligibility: e.target.value })}>
                  <option value="">All</option>
                  {[...new Set(employees.map(e => e.eligibility))].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <button className="apply-filter-btn" onClick={() => {
                const filtered = employees.filter(emp => {
                  return (!filters.office || emp.office === filters.office)
                    && (!filters.employment_status || emp.employment_status === filters.employment_status)
                    && (!filters.eligibility || emp.eligibility === filters.eligibility)
                    && emp.full_name.toLowerCase().includes(searchTerm.toLowerCase());
                });
                setFilteredEmployees(filtered);
                setShowFilterMenu(false);
              }}>✅ Apply Filters</button>
            </div>
          )}
        </div>
      </div>
        {/* Employee Grid */}
      <div className="employee-grid">
        {filteredEmployees.length === 0 ? (
          <div className="employee-card placeholder">
            <div className="image-wrapper">
              <div className="placeholder-photo" />
              <div className="placeholder-emblem" />
            </div>
            <div className="placeholder-name">No employee records found.</div>
          </div>
        ) : (
          filteredEmployees.map(emp => (
            <div
              key={emp.id}
              className="employee-card"
              onClick={() => { setSelectedEmployee(emp); setEditMode(false); }}
            >
              <div className="image-wrapper">
                <img src={emp.photo_url} alt={emp.full_name} className="employee-photo" />
                <img src={emp.emblem_url || "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png"} alt="Emblem" className="emblem" />
              </div>
              <div className="employee-name">{emp.full_name}</div>
            </div>
          ))
        )}
      </div>
        {/* Employee Add Button */}
      <button className="floating-add-btn" onClick={() => setShowForm(true)} title="Add Employee">➕</button>
        {/* Employee Add Window */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            <h2 className="form-title">Add New Employee</h2>
            <form className="employee-form" onSubmit={handleSubmit}>
              {["full_name","position_title","employment_status","eligibility"].map(field => (
                <div key={field} className="form-group">
                  <label>{field.replace("_", " ").replace(/\b\w/g,c=>c.toUpperCase())}</label>
                  <input type="text" name={field} value={formData[field]} onChange={handleFormChange} required />
                </div>
              ))}
              <div className="form-group">
                <label>Office or Department</label>
                <select name="office" value={formData.office} onChange={handleFormChange} required>
                  <option value="" disabled selected>Select an office</option>
                  {Object.keys(officeEmblems).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "photo_url", setFormData)} required />
                {formData.photo_url && <img src={formData.photo_url} alt="Preview" style={{width:100, marginTop:10}} />}
              </div>
              <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Submit"}</button>
              {message && <p className="form-message">{message}</p>}
            </form>
          </div>
        </div>
      )}
        {/* Employee Detailed Window */}
      {selectedEmployee && (
        <div className="details-modal-overlay" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>
          <div className="details-modal-content" onClick={e => e.stopPropagation()}>
            <button className="details-modal-close" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>&times;</button>
            {editMode ? (
              <form className="details-edit-form" onSubmit={handleEditSubmit}>
                <h2>Edit Employee</h2>
                {["full_name","position_title","office","employment_status","eligibility"].map(field => (
                  <div key={field} className="form-group">
                    <label>{field.replace("_", " ").replace(/\b\w/g,c=>c.toUpperCase())}</label>
                    <input type="text" name={field} value={editFormData[field] || ""} onChange={handleEditChange} required={field !== "office"} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Change Photo</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "photo_url", setEditFormData)} />
                  {editFormData.photo_url && <img src={editFormData.photo_url} alt="Preview" style={{width:100, marginTop:10}} />}
                </div>
                <div className="form-group">
                  <label>Office Emblem</label>
                  <img src={editFormData.emblem_url} alt="Office Emblem" style={{width:80, marginTop:10}} />
                </div>
                <div className="form-footer">
                  <button type="submit" disabled={uploading}>{uploading ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="details-header">
                  <img src={selectedEmployee.photo_url} alt={selectedEmployee.full_name} className="details-photo" />
                  <img src={selectedEmployee.emblem_url} alt="Emblem" className="details-emblem" />
                  <h2>{selectedEmployee.full_name}</h2>
                  <p>{selectedEmployee.position_title}</p>
                </div>
                <div className="details-body">
                  <p><strong>Office:</strong> {selectedEmployee.office}</p>
                  <p><strong>Employment Status:</strong> {selectedEmployee.employment_status}</p>
                  <p><strong>Eligibility:</strong> {selectedEmployee.eligibility}</p>
                </div>
                <div className="details-actions">
                  <button className="edit-btn" onClick={openEdit}>✏️ Edit</button>
                  <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Employee;
