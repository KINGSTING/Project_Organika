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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees/get_employee", {
        withCredentials: true,
      });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleSearch = () => {
    const filtered = employees.filter((emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo_url) {
      alert("Please upload a photo before submitting.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/employees/create_employee",
        formData,
        { withCredentials: true }
      );
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete("http://localhost:5000/employees/delete_employee", {
          data: { id: selectedEmployee.id },
          withCredentials: true,
        });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditClick = () => {
    setEditFormData(selectedEmployee);
    setEditMode(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleImageUpload = async (e, key, setStateFunc) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append("upload_preset", "employee_unsigned");

    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzn6wdijk/image/upload",
        imageFormData
      );
      const imageUrl = res.data.secure_url;
      setStateFunc((prev) => ({ ...prev, [key]: imageUrl }));
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="employee-page">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>

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
          filteredEmployees.map((emp) => (
            <div
              className="employee-card"
              key={emp.id}
              onClick={() => {
                setSelectedEmployee(emp);
                setEditMode(false);
              }}
            >
              <div className="image-wrapper">
                <img
                  src={emp.photo_url || "/placeholder-photo.png"}
                  alt={emp.full_name}
                  className="employee-photo"
                />
                <img
                  src={emp.emblem_url || "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png"}
                  alt="Emblem"
                  className="emblem"
                />
              </div>
              <div className="employee-name">{emp.full_name}</div>
            </div>
          ))
        )}
      </div>

      <button
        className="floating-add-btn"
        onClick={() => setShowForm(true)}
        title="Add Employee"
      >
        ➕
      </button>
          {/* Adding Employee Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <h2 className="form-title">➕ Add New Employee</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              {["Employee Name", "Position Title", "Office or Department", "Employment Status", "Eligibility", "Emblem"].map((field) => (
                <div key={field} className="form-group">
                  <label>{field.replace(/_/g, " ")}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={field !== "emblem_url"}
                  />
                </div>
              ))}

              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "photo_url", setFormData)}
                  required
                />
                {formData.photo_url && (
                  <img src={formData.photo_url} alt="Uploaded" style={{ width: "100px", marginTop: "0.5rem" }} />
                )}
              </div>

              <button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Submit"}
              </button>
              {message && <p className="form-message">{message}</p>}
            </form>
          </div>
        </div>
      )}
        {/* Detailed Information Modal */}
      {selectedEmployee && (
        <div
          className="details-modal-overlay"
          onClick={() => {
            setSelectedEmployee(null);
            setEditMode(false);
          }}
        >
          <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="details-modal-close"
              onClick={() => {
                setSelectedEmployee(null);
                setEditMode(false);
              }}
            >
              &times;
            </button>
           {editMode ? (
              <form className="details-edit-form" onSubmit={handleEditSubmit}>
                <h2>Edit Employee</h2>
                {[
                  ["full_name", "Employee Name"],
                  ["position_title", "Position Title"],
                  ["office", "Office/Department"],
                  ["employment_status", "Employment Status"],
                  ["eligibility", "Eligibility"],
                  ["emblem_url", "Emblem URL"],
                ].map(([field, label]) => (
                  <div key={field} className="form-group">
                    <label>{label}</label>
                    <input
                      type="text"
                      name={field}
                      value={editFormData[field] || ""}
                      onChange={handleEditChange}
                      required={field !== "emblem_url"}
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label>Change Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "photo_url", setEditFormData)
                    }
                  />
                  {editFormData.photo_url && (
                    <img
                      src={editFormData.photo_url}
                      alt="Preview"
                      style={{ width: "100px", marginTop: "0.5rem" }}
                    />
                  )}
                </div>

                <div className="form-footer">
                  <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Save"}
                  </button>
                  <button type="button" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="details-header">
                  <img
                    className="details-photo"
                    src={selectedEmployee.photo_url || "/placeholder-photo.png"}
                    alt={selectedEmployee.full_name}
                  />
                  <img
                    className="details-emblem"
                    src={selectedEmployee.emblem_url || "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png"}
                    alt="Emblem"
                  />
                  <h2>{selectedEmployee.full_name}</h2>
                  <p>{selectedEmployee.position_title}</p>
                </div>

                <div className="details-body">
                  <p><strong>Office:</strong> {selectedEmployee.office || "N/A"}</p>
                  <p><strong>Employment Status:</strong> {selectedEmployee.employment_status}</p>
                  <p><strong>Eligibility:</strong> {selectedEmployee.eligibility}</p>
                </div>

                <div className="details-actions">
                  <button className="edit-btn" onClick={handleEditClick}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(selectedEmployee.id)}>🗑️ Delete</button>
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
