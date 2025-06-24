import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plantilla" element={<Plantilla />} />
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
