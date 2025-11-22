import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // logged-in user info

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(
        "https://back-project-olive.vercel.app/auth/current-user",
        { withCredentials: true } // send cookie
      );
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
      setCurrentUser(null);
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/posts");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  // Delete a post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`https://back-project-olive.vercel.app/posts/${postId}`, {
        withCredentials: true, // send cookie
      });

      setReports((prev) => prev.filter((r) => r._id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete post");
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
          {reports.map((report) => {
            const canDelete =
              currentUser &&
              (currentUser.role === "admin" || report.author === currentUser._id);

            return (
              <div key={report._id} className="report-card">
                <ImageCarousel images={[report.image]} />
                <div className="report-info">
                  <h3>{report.descriptione}</h3>
                  <p>
                    <strong>Location:</strong> {report.Location}
                  </p>
                  {canDelete && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(report._id)}
                    >
                      Delete
                    </button>
                  )}
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
