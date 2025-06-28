import { useState } from "react";
import axios from "axios";
import "./styles/Plantilla.css"; // Link to external CSS

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
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error
          ? "Error: " + err.response.data.error
          : "An unknown error occurred."
      );
    }
  };

  return (
    <div className="plantilla-table-container">
      <table className="plantilla-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Position Title</th>
            <th>Salary Grade</th>
            <th>Office/Dept</th>
            <th>Funding Status</th>
            <th>Employee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example static row */}
          <tr>
            <td>001-23</td>
            <td>Administrative Officer</td>
            <td>18</td>
            <td>HRMO</td>
            <td>National</td>
            <td>Juan Dela Cruz</td>
            <td>
              <button className="edit-btn">✏️</button>
              <button className="delete-btn">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Plantilla;
