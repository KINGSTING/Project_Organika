import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";
import Dashboard from "./pages/Dashboard";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Router>
      <link rel="icon" type="image/x-icon" href="https://res.cloudinary.com/dzn6wdijk/image/upload/v1751521019/lgu-kauswagan-logo_cmqgz6.png" />
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Conditionally render Navbar */}
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
