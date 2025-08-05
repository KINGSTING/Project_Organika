import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./styles/Navbar.css";
import logo from "../assets/lgu_kauswagan_logo.png";

function Navbar() {
  const { pathname } = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const toggleLoginModal = () => {
    setError("");
    setShowLoginModal(!showLoginModal);
  };

  const openSignupModal = () => {
    setError("");
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const closeSignupModal = () => {
    setError("");
    setShowSignupModal(false);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful");
        setLoginData({ username: "", password: "" });
        setShowLoginModal(false);
        window.location.reload();
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Login error");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful");
        setSignupData({ username: "", password: "", role: "admin" });
        setShowSignupModal(false);
        setShowLoginModal(true);
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      setError("Signup error");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
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

          <ul className="navbar-links">
            <li><Link to="/" className={pathname === "/" ? "active" : ""}>Dashboard</Link></li>
            <li><Link to="/plantilla" className={pathname === "/plantilla" ? "active" : ""}>Plantilla</Link></li>
            <li><Link to="/employee" className={pathname === "/employee" ? "active" : ""}>Employee</Link></li>
            <li>
              <button className="login-icon-button" onClick={toggleLoginModal}>🔐</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={toggleLoginModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={toggleLoginModal}>✖</button>
            <h2>Admin Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: "10px" }}>
              Don’t have an account?{" "}
              <span
                onClick={openSignupModal}
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              >
                Sign up
              </span>
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <div className="modal-overlay" onClick={closeSignupModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeSignupModal}>✖</button>
            <h2>Admin Sign Up</h2>
            <form className="signup-form" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
