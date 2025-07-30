import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Employee.css";

function Employee({ setShowModal }) {
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
  const [showServiceRecordModal, setShowServiceRecordModal] = useState(false);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [filters, setFilters] = useState({
    office: "",
    employment_status: "",
    eligibility: ""
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";
  const officeEmblems = {
      "Sangguniang Bayan": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896048/KAUSWAGAN-SB-LOGO-150x150_cbsnu6.png",
      "General Services Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/GSO-logo-02-150x150_tmeknk.png",
      "Municipal Treasury Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/uswag-Panudlanan-Profile-150x150_uvgdjh.png",
      "Municipal Civil Registrar Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/Lgu-kauswagan-civil-registrar-logo_kqopdu.jpg",
      "Municipal Health Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751896047/lgu-kauswagan-health-office-logo_ebmuzm.png",
      "Municipal Mayor's Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
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
      "Municipal Disaster Risk and Reduction and Management Office": "https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png",
    };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
      setShowModal?.(showForm);
    }, [showForm, setShowModal]);

  useEffect(() => {
      const filtered = employees.filter((emp) =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/employees/get_employee`, { withCredentials: true });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchServiceRecords = async (employeeId) => {
    try {
      const res = await axios.get(`${API_BASE}/employees/service_records`, {
        params: { employee_id: employeeId },
        withCredentials: true,
      });
      setServiceRecords(res.data);
      setShowServiceRecordModal(true);
    } catch (err) {
      console.error("Failed to fetch service records:", err);
    }
  };

  const handleSearch = () => {
    setFilteredEmployees(
      employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
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

  const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === "office" && officeEmblems[value]) {
          updated.emblem_url = officeEmblems[value];
        }
        return updated;
      });
    };


  const applyFilters = () => {
      let filtered = employees;

      if (filters.office) {
        filtered = filtered.filter(emp => emp.office === filters.office);
      }

      setFilteredEmployees(filtered);
    };

    const resetFilters = () => {
      setFilters({ ...filters, office: "" });
      setFilteredEmployees(employees);
    };

    return (
      <section className="employee-page">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employee..."
            />
            <button className="search-button" onClick={handleSearch}>Search</button>

            <div className="filter-wrapper">
              <button className="filter-button" onClick={() => setShowFilterMenu(prev => !prev)}>
                Filter
              </button>

              {showFilterMenu && (
                <div className="filter-popup">
                  <label className="filter-label">Office/Department</label>
                  <select
                    value={filters.office}
                    onChange={(e) => setFilters(prev => ({ ...prev, office: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyFilters();
                      }
                    }}
                  >
                    <option value="">All</option>
                    {Object.keys(officeEmblems).map((office) => (
                      <option key={office} value={office}>{office}</option>
                    ))}
                  </select>

                  <button className="apply-btn" onClick={applyFilters}>✅ Apply Filters</button>
                  <button className="reset-btn" onClick={resetFilters}>🔁 Reset</button>
                </div>
              )}
            </div>

            <button className="floating-add-btn" onClick={() => setShowForm(true)}>＋</button>
          </div>

      {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
              <h3 className="form-title">Add New Employee</h3>
              <form className="employee-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  {Object.entries(formData).map(([key, val]) => {
                      if (key === "emblem_url") return null;

                      return (
                        <div className="form-group" key={key}>
                          <label htmlFor={key}>{key.replace(/_/g, " ").toUpperCase()}</label>

                          {key === "photo_url" ? (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, key, setFormData)}
                              />
                              {val && <img src={val} alt="Preview" style={{ width: "100px", marginTop: "8px" }} />}
                            </>
                          ) : key === "office" ? (
                            <select id={key} name={key} value={val} onChange={handleFormChange}>
                              <option value="">Select an office</option>
                              {Object.keys(officeEmblems).map((office) => (
                                <option key={office} value={office}>{office}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={key.includes("date") ? "date" : "text"}
                              id={key}
                              name={key}
                              value={val}
                              onChange={handleFormChange}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
                <div className="form-footer">
                  <button type="submit" className="submit-btn">➕ Save Employee</button>
                </div>
              </form>
            </div>
          </div>
        )}

      <div className="employee-grid">
        {filteredEmployees.map(emp => (
          <div className="employee-card" key={emp.id} onClick={() => setSelectedEmployee(emp)}>
            <div className="image-wrapper">
              <img src={emp.photo_url} className="employee-photo" alt={emp.full_name} />
              {emp.emblem_url && <img src={emp.emblem_url} className="emblem" alt="Office Emblem" />}
            </div>
            <div className="employee-name">{emp.full_name}</div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="details-modal-overlay" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>
          <div className="details-modal-content" onClick={e => e.stopPropagation()}>
            <button className="details-modal-close" onClick={() => { setSelectedEmployee(null); setEditMode(false); }}>&times;</button>
            {!editMode ? (
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
                  <button className="record-btn" onClick={() => fetchServiceRecords(selectedEmployee.id)}>📄 Show Service Record</button>
                </div>
              </div>
            ) : (
              <form className="details-edit-form" onSubmit={handleEditSubmit}>
                  {Object.entries(editFormData).map(([key, val]) => {
                    if (key === "emblem_url") return null; // 🛑 Skip rendering this field

                    if (key === "photo_url") {
                      return (
                        <div className="form-group" key={key}>
                          <label>PHOTO</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, key, setEditFormData)}
                          />
                          {val && (
                            <div className="image-preview">
                              <img src={val} alt="Uploaded" style={{ width: "100px", marginTop: "10px" }} />
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="form-group" key={key}>
                        <label>{key.replace(/_/g, " ").toUpperCase()}</label>
                        <input
                          type={key.includes("date") ? "date" : "text"}
                          name={key}
                          value={val || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                    );
                  })}
                  <button type="submit">Save</button>
                </form>
            )}
          </div>
        </div>
      )}

      {showServiceRecordModal && (
        <div className="details-modal-overlay-2" onClick={() => setShowServiceRecordModal(false)}>
          <div className="details-modal-content-2" onClick={e => e.stopPropagation()}>
            <button className="details-modal-close" onClick={() => setShowServiceRecordModal(false)}>&times;</button>
            <h2>Service Record</h2>
            <table className="service-record-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Office</th>
                  <th>Leave without Pay</th>
                  <th>Separation</th>
                  <th>Cause</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {serviceRecords.map(record => (
                  <tr key={record.id}>
                    <td>{new Date(record.start_date).toLocaleDateString("en-US")}</td>
                    <td>{record.end_date ? new Date(record.end_date).toLocaleDateString("en-US") : 'Present'}</td>
                    <td>{record.position_title}</td>
                    <td>{record.status}</td>
                    <td>{record.salary_monthly?.toLocaleString()}</td>
                    <td>{record.office}</td>
                    <td>{record.leave_without_pay}</td>
                    <td>{record.separation_date || ''}</td>
                    <td>{record.separation_cause || ''}</td>
                    <td>{record.remarks || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Employee;
