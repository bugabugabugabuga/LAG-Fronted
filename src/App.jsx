// App.jsx
import React, { useState, useEffect, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Home from "./components/Home.jsx";
import Report from "./components/Report.jsx";
import CleanUp from "./components/CleanUp.jsx";
import SignUp from "./components/Sign-up.jsx";
import SignIn from "./components/Sign-in.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import settingsIcon from "./assets/setting.png";
import "./App.css";

// ----- User Context -----
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user if token exists or changes
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setLoadingUser(true);
      axios
        .get("https://back-project-olive.vercel.app/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoadingUser(false));
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [Cookies.get("token")]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ----- Header -----
function Header() {
  const { user, setUser, loadingUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateProfile = (e) => setProfileImage(e?.detail || null);
    window.addEventListener("profileImageChanged", updateProfile);
    return () => window.removeEventListener("profileImageChanged", updateProfile);
  }, []);

  const navigateTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setProfileImage(null);
    navigateTo("/SignIn");
  };

  // Show loading header until user loads
  if (loadingUser) return <header className="header">Loading...</header>;

  const isLoggedIn = !!user;
  const role = user?.role;

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

      <div className="auth-buttons">
        <img
          src={settingsIcon}
          alt="Settings"
          className="settings-icon"
          onClick={() => setOpen(!open)}
        />
        <div className={`dropdown ${open ? "open" : ""}`}>
          {isLoggedIn && role === "admin" && (
            <button className="header-btn" onClick={() => navigateTo("/Dashboard")}>
              Dashboard
            </button>
          )}

          {isLoggedIn ? (
            <>
              <button className="header-btn profile-btn" onClick={() => navigateTo("/Profile")}>
                {profileImage && <img src={profileImage} alt="Profile" className="profile-circle" />}
                <span className="profile-tag">Profile</span>
              </button>
              <button className="header-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="header-btn" onClick={() => navigateTo("/SignIn")}>Login</button>
              <button className="header-btn" onClick={() => navigateTo("/SignUp")}>Register</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ----- Main App -----
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/CleanUp" element={<CleanUp />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
