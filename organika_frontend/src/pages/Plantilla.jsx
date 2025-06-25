import { useState } from "react";
import axios from "axios";

function AddPlantillaItem() {
  const [formData, setFormData] = useState({
    item_code: "",
    position_title: "",
    salary_grade: "",
    office: "",
    status: "",
    funding_status: "",
    employee_id: "", // optional
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
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage("Error: " + err.response.data.error);
      } else {
        setMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📁 Add Plantilla Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["item_code", "Item Code"],
          ["position_title", "Position Title"],
          ["salary_grade", "Salary Grade"],
          ["office", "Office"],
          ["status", "Status"],
          ["funding_status", "Funding Status"],
          ["employee_id", "Employee ID (optional)"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required={name !== "employee_id"}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}

export default AddPlantillaItem;
