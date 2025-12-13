// App.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Report from "./components/Report.jsx";
import CleanUp from "./components/CleanUp.jsx";
import SignUp from "./components/Sign-up.jsx";
import SignIn from "./components/Sign-in.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Donate from "./components/Donate.jsx";
import "./App.css";
import { UserProvider, UserContext } from "./context/user-provider.jsx";
import Cookies from "js-cookie";
import axios from "axios";

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
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

// Header component
function Header() {
  const { user, setUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from token if not already in context
  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !user) {
      axios
        .get("https://back-project-olive.vercel.app/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setProfileImage(res.data.avatar || null);
        })
        .catch((err) => {
          console.error("Failed to fetch user on app load", err);
          setUser(null);
        });
    }
  }, [user, setUser]);

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setProfileImage(null);
    navigateTo("/SignIn");
  };

  const isLoggedIn = !!user;
  const role = user?.role;

  return (
    <header className="header">
      <div className="logo-container" onClick={() => navigateTo("/")}>
        <img
          className="logo"
          src="https://i0.wp.com/discoverandshare.org/wp-content/uploads/2025/07/da62b-recycling_sign_green.png?fit=1024%2C1024&ssl=1"
          alt="Logo"
        />
        <h4 className="main">CleanQuest</h4>
      </div>

      <div className="btn-group">
        <label className={`btn ${location.pathname === "/" ? "active" : ""}`}>
          <input
            type="radio"
            hidden
            checked={location.pathname === "/"}
            onChange={() => navigateTo("/")}
          />
          <span>Feed</span>
        </label>
        <label className={`btn ${location.pathname === "/Report" ? "active" : ""}`}>
          <input
            type="radio"
            hidden
            checked={location.pathname === "/Report"}
            onChange={() => navigateTo("/Report")}
          />
          <span>Report</span>
        </label>
      </div>

      <div className="header-buttons">
        {isLoggedIn && role === "admin" && (
          <button className="header-btn" onClick={() => navigateTo("/Dashboard")}>
            <img src="/icons/dashboard.png" alt="Dashboard" className="icon" /> Dashboard
          </button>
        )}

        {isLoggedIn ? (
          <>
            <button className="header-btn" onClick={() => navigateTo("/Profile")}>
              {profileImage && <img src={profileImage} alt="Profile" className="profile-circle" />}
              Profile
            </button>
            <button className="header-btn" onClick={handleLogout}>
              <img src="/icons/logout.png" alt="Logout" className="icon" /> Logout
            </button>
          </>
        ) : (
          <>
            <button className="header-btn" onClick={() => navigateTo("/SignIn")}>
              <img src="/icons/login.png" alt="Login" className="icon" /> Login
            </button>
            <button className="header-btn" onClick={() => navigateTo("/SignUp")}>
              <img src="/icons/register.png" alt="Register" className="icon" /> Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default App;
