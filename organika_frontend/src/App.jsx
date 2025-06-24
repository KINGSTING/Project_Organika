import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-blue-700 text-white px-6 py-4 shadow">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">Dashboard</Link>
            </li>
            <li>
              <Link to="/plantilla" className="hover:underline">Plantilla</Link>
            </li>
            <li>
              <Link to="/employee" className="hover:underline">Employee</Link>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl font-bold">📊 Organika Dashboard</h1>} />
            <Route path="/plantilla" element={<Plantilla />} />
            <Route path="/employee" element={<Employee />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
