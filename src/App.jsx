// App.jsx
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

  // Google login redirect handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      localStorage.setItem("loggedIn", "true");

      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", payload.role);
      localStorage.setItem("email", payload.userId);

      setProfileImage(localStorage.getItem(`profileImage_${payload.userId}`) || null);

      if (payload.role === "admin") navigate("/Dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [navigate]);

  const email = localStorage.getItem("email");
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

    updateProfile();
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
                  navigateTo("/sign-in"); // fixed path
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
