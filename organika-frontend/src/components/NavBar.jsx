import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">🌿 Organika</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/plantilla" className="hover:underline">Plantilla</Link>
        <Link to="/employee" className="hover:underline">Employee</Link>
      </div>
    </nav>
  );
}

export default Navbar;
