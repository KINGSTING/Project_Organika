import { useState } from "react";
import axios from "axios";

function Plantilla() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/plantilla", {
        test_input: input,
      });
      setResponse(res.data.msg);
    } catch (err) {
      console.error("Error:", err);
      setResponse("Error sending request");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">📁 Plantilla Management</h2>
      <form onSubmit={handleSubmit} className="space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2"
          placeholder="Enter test input"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
      {response && <p className="mt-4 text-green-700">{response}</p>}
    </div>
  );
}

export default Plantilla;