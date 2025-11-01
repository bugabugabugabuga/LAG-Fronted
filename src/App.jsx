import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";
import Report from "./components/Report.jsx";
import CleanUp from "./components/CleanUp.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import settingsIcon from "./assets/setting.png";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/CleanUp" element={<CleanUp />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

// ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem("role");
  if (role !== requiredRole) {
    return <Navigate to="/" replace />; // redirect if role doesn't match
  }
  return children;
};

// Header component
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const email = localStorage.getItem("email"); // current logged-in user
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const [profileImage, setProfileImage] = useState(
    email ? localStorage.getItem(`profileImage_${email}`) : null
  );

  const navigateTo = (path) => {
    if (location.pathname !== path) navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateProfile = () => {
      const newEmail = localStorage.getItem("email");
      if (newEmail) {
        setProfileImage(localStorage.getItem(`profileImage_${newEmail}`) || null);
      } else {
        setProfileImage(null);
      }
    };

    updateProfile(); // initial load
    window.addEventListener("profileImageChanged", updateProfile);
    return () => window.removeEventListener("profileImageChanged", updateProfile);
  }, []);

  return (
    <header className="header">
      <img
        onClick={() => navigateTo("/")}
        className="logo"
        src="https://i0.wp.com/discoverandshare.org/wp-content/uploads/2025/07/da62b-recycling_sign_green.png?fit=1024%2C1024&ssl=1"
        alt="Logo"
      />
      <h4 className="main">CleanQuest</h4>

      <div className="btn-group">
        <label className={`btn ${location.pathname === "/" ? "active" : ""}`}>
          <input type="radio" hidden checked={location.pathname === "/"} onChange={() => navigateTo("/")} />
          <span>Feed</span>
        </label>
        <label className={`btn ${location.pathname === "/Report" ? "active" : ""}`}>
          <input type="radio" hidden checked={location.pathname === "/Report"} onChange={() => navigateTo("/Report")} />
          <span>Report</span>
        </label>
        <label className={`btn ${location.pathname === "/CleanUp" ? "active" : ""}`}>
          <input type="radio" hidden checked={location.pathname === "/CleanUp"} onChange={() => navigateTo("/CleanUp")} />
          <span>CleanUp</span>
        </label>
      </div>

      <div className="auth-buttons" ref={dropdownRef}>
        <img src={settingsIcon} alt="Settings" className="settings-icon" onClick={() => setOpen(!open)} />
        <div className={`dropdown ${open ? "open" : ""}`}>
          {isLoggedIn && role === "admin" && (
            <button className="header-btn" onClick={() => navigateTo("/Dashboard")}>Dashboard</button>
          )}

          {isLoggedIn ? (
            <>
              <button className="header-btn profile-btn" onClick={() => navigateTo("/Profile")}>
                {profileImage && <img src={profileImage} alt="Profile" className="profile-circle" />}
                <span className="profile-tag">Profile</span>
              </button>

              <button
                className="header-btn"
                onClick={() => {
                  localStorage.removeItem("loggedIn");
                  localStorage.removeItem("role");
                  localStorage.removeItem("email");
                  setProfileImage(null);
                  navigateTo("/Login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="header-btn" onClick={() => navigateTo("/Login")}>Login</button>
              <button className="header-btn" onClick={() => navigateTo("/Register")}>Register</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default App;
