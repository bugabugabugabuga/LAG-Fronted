import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("https://back-project-olive.vercel.app/posts", {
          withCredentials: true, // important for cookie
        });
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`https://back-project-olive.vercel.app/posts/${id}`, {
        withCredentials: true, // send cookie
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post. You might not have permission.");
    }
  };

  const userId = localStorage.getItem("userId"); // optional if you store it
  const userRole = localStorage.getItem("role"); // admin or user

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
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <ImageCarousel images={[report.image]} />
              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                {(report.author._id === userId || userRole === "admin") && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(report._id)}
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
