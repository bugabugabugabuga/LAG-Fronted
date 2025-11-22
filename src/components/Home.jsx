import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "./ImageCarousel";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          "https://back-project-olive.vercel.app/auth/current-user",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUser(res.data); // { fullname, email, role, _id, ... }
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Fetch all reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("https://back-project-olive.vercel.app/posts");
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  // Delete a report
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`https://back-project-olive.vercel.app/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((r) => r._id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>
            Report trash spots, volunteer for cleanups, and support environmental heroes.
          </p>
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
                <p>
                  <strong>Location:</strong> {report.Location}
                </p>
                <p>
                  <strong>Posted by:</strong> {report.author?.fullname || "Anonymous"}
                </p>
              </div>

              {(currentUser?.role === "admin" || report.author?._id === currentUser?._id) && (
                <button
                  className="delete-post-btn"
                  onClick={() => handleDelete(report._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
