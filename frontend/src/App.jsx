import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./pages/Navbar";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";
import Dashboard from "./pages/Dashboard";
import API from "./api";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await API.get("/auth/verify"); // Make sure this endpoint exists
        if (res.status === 200) setLoggedIn(true);
        else setLoggedIn(false);
      } catch {
        setLoggedIn(false);
      }
    };
    verifyToken();
  }, []);

  if (!loggedIn) return <LoginPage setLoggedIn={setLoggedIn} />;

  return (
    <Router>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-gray-50">
        {!showModal && <Navbar />}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Dashboard setShowModal={setShowModal} />} />
            <Route path="/plantilla" element={<Plantilla setShowModal={setShowModal} />} />
            <Route path="/employee" element={<Employee setShowModal={setShowModal} />} />
            <Route path="*" element={<h1 className="text-red-600 text-xl">404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
