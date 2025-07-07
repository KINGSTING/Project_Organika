import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Plantilla from "./pages/Plantilla";
import Employee from "./pages/Employee";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
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