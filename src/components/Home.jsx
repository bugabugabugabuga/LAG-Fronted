import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import axios from "axios";
import "./Home.css";

// Enable cookies for all axios requests
axios.defaults.withCredentials = true;

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null); // contains _id and role

  // Fetch current user FROM COOKIE (token is httpOnly!)
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(
        "https://back-project-olive.vercel.app/auth/current-user"
      );
      setUser(res.data); 
    } catch (err) {
      setUser(null); // user not logged in
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "https://back-project-olive.vercel.app/posts"
      );
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  // Delete report
  const handleDelete = async (reportId, authorId) => {
    if (!user) return alert("You must be logged in.");

    const isAdmin = user.role === "admin";
    const isAuthor = user._id === authorId;

    if (!isAdmin && !isAuthor) {
      return alert("You do not have permission to delete this report.");
    }

    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(
        `https://back-project-olive.vercel.app/posts/${reportId}`
      );
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

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
          {reports.map((report) => {
            const canDelete =
              user &&
              (user.role === "admin" || user._id === report.author?._id);

            return (
              <div key={report._id} className="report-card">
                <ImageCarousel images={[report.image]} />
                <div className="report-info">
                  <h3>{report.descriptione}</h3>
                  <p><strong>Location:</strong> {report.Location}</p>
                  <p><strong>Author:</strong> {report.author?.fullname || "Unknown"}</p>

                  {canDelete && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(report._id, report.author?._id)}
                    >
                      Delete
                    </button>
                    
                  )}

                  <button>donate</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
