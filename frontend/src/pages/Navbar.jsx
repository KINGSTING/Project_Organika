import { Link, useLocation } from "react-router-dom";
import "./styles/Navbar.css";
import logo from "../assets/lgu_kauswagan_logo.png";

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo and Title */}
        <div className="navbar-left">
          <img src={logo} alt="Kauswagan Logo" className="navbar-logo" />
          <a
            href="https://kauswagan.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-title"
          >
            Municipality of Kauswagan
          </a>
        </div>

        {/* Right: Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/" className={pathname === "/" ? "active" : ""}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/plantilla" className={pathname === "/plantilla" ? "active" : ""}>
              Plantilla
            </Link>
          </li>
          <li>
            <Link to="/employee" className={pathname === "/employee" ? "active" : ""}>
              Employee
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
