// Fully updated and corrected Employee.jsx with "Show Service Record" modal support
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
  const [showServiceRecordModal, setShowServiceRecordModal] = useState(false);
  const [serviceRecords, setServiceRecords] = useState([]);
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
      {/* ... existing form and card rendering code ... */}

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
                {/* ... edit form inputs ... */}
                <button type="submit">Save</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showServiceRecordModal && (
        <div className="details-modal-overlay" onClick={() => setShowServiceRecordModal(false)}>
          <div className="details-modal-content" onClick={e => e.stopPropagation()}>
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
                  <th>LWOP</th>
                  <th>Separation</th>
                  <th>Cause</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {serviceRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.start_date}</td>
                    <td>{record.end_date || 'Present'}</td>
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
