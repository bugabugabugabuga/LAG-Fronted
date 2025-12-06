import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import axios from "axios";
import Cookies from "js-cookie";
import "./Home.css";
import { UserContext } from "../context/user-provider";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const { user, setUser } = useContext(UserContext);

  // --- Fetch current user using cookie ---
  const fetchCurrentUser = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "https://back-project-olive.vercel.app/auth/current-user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRole(res.data.role);
      setUserId(res.data._id);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  // --- Fetch reports ---
  const fetchReports = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/posts");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    }
  };

  // --- Delete report ---
  const handleDelete = async (reportId, authorId) => {
    const token = Cookies.get("token");
    const isAdmin = userRole === "admin";
    const isAuthor = authorId === userId;

    if (!isAdmin && !isAuthor) {
      return alert("You do not have permission to delete this report.");
    }

    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(
        `https://back-project-olive.vercel.app/posts/${reportId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

  // --- Donate handler ---
  const handleDonate = (reportId) => {
    alert("Donation system coming soon! Report ID: " + reportId);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>Report trash spots, volunteer for cleanups, and support environmental heroes.</p>
          <div className="hero-buttons">
            <button className="report-btn" onClick={() => navigate("/Report")}>
              Report Trash Spot
            </button>
          </div>
        </div>
      </section>

      <section className="feed">
        <h2 className="cf">Community Feed</h2>
        <div className="report-list">
          {reports.length === 0 && <p>No reports yet.</p>}

          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <ImageCarousel images={[report.image]} />

              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                <p><strong>Author:</strong> {report.author?.fullname || "Unknown"}</p>

                {/* --- SHOW DONATE BUTTON ONLY IF LOGGED IN --- */}
                {user && (
                  <button
                    className="donate-btn"
                    onClick={() => handleDonate(report._id)}
                  >
                    Donate
                  </button>
                )}

                {/* DELETE BUTTON */}
                {(userRole === "admin" || report.author?._id === userId) && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(report._id, report.author?._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
