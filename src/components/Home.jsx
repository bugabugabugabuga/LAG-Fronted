import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("https://back-project-olive.vercel.app/posts");
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>
            Report trash spots, volunteer for cleanups, and support environmental heroes.
          </p>
          <div className="hero-buttons">
            <button
              className="report-btn"
              onClick={() => navigate("/Report")}
            >
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
                <p>
                  <strong>Location:</strong> {report.Location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
