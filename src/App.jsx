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

// icons
import HomeIcon from "./assets/home.png";
import ReportIcon from "./assets/report.png";
import AccountIcon from "./assets/account.png";
import UserIcon from "./assets/user.png";
import DashboardIcon from "./assets/dashboard.png";
import LogoutIcon from "./assets/logout.png";

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

/* ================= HEADER ================= */
function Header() {
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !user) {
      axios
        .get("https://back-project-olive.vercel.app/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [user, setUser]);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/SignIn");
    setOpen(false);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <header className="header">
      {/* LOGO */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <img
          className="logo"
          src="https://i0.wp.com/discoverandshare.org/wp-content/uploads/2025/07/da62b-recycling_sign_green.png"
          alt="Logo"
        />
        <h1 className="main">CleanQuest</h1>
      </div>

      {/* NAV */}
      <nav className="nav-buttons">
        <button
          className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          <img src={HomeIcon} className="nav-icon" />
          Feed
        </button>

        <button
          className={`nav-btn ${location.pathname === "/Report" ? "active" : ""}`}
          onClick={() => navigate("/Report")}
        >
          <img src={ReportIcon} className="nav-icon" />
          Report
        </button>
      </nav>

      {/* ACCOUNT */}
      <div className="account-wrapper">
        <button className="account-btn" onClick={() => setOpen(!open)}>
          <img
            src={isLoggedIn ? UserIcon : AccountIcon}
            className="nav-icon"
          />
        </button>

        {open && (
          <div className="account-dropdown">
            {!isLoggedIn && (
              <>
                <button onClick={() => navigate("/SignIn")}>Login</button>
                <button onClick={() => navigate("/SignUp")}>Register</button>
              </>
            )}

            {isLoggedIn && (
              <>
                <button onClick={() => navigate("/Profile")}>Profile</button>

                {isAdmin && (
                  <button onClick={() => navigate("/Dashboard")}>
                    <img src={DashboardIcon} className="nav-icon" />
                    Dashboard
                  </button>
                )}

                <button onClick={handleLogout}>
                  <img src={LogoutIcon} className="nav-icon" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default App;
