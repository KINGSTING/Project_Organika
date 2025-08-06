import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from 'react-toastify';
import Navbar from "./pages/Navbar";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";
import Dashboard from "./pages/Dashboard";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  // Decode JWT on load and set user appropriately
  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (token && storedUser) {
    try {
      jwtDecode(token);
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  } else {
    setUser(null);
  }
}, []);

  return (
    <Router>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-gray-50">
        {!showModal && <Navbar user={user} setUser={setUser} />}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Dashboard setShowModal={setShowModal} user={user} />} />
            <Route path="/plantilla" element={<Plantilla setShowModal={setShowModal} user={user} />} />
            <Route path="/employee" element={<Employee setShowModal={setShowModal} user={user} />} />
            <Route path="*" element={<h1 className="text-red-600 text-xl">404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;