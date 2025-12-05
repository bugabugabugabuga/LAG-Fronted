import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import "./Home.css";
import { UserContext } from "../context/user-provider";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const {user, setUser} = useContext(UserContext);
  const token = Cookies.get('token')

  // --- Fetch current user using cookie ---
  const fetchCurrentUser = async () => {
    const token = Cookies.get("token"); // get token from cookie
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
 const handleDeletePost = async (id) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // header auth like teacher
        "Content-Type": "application/json"
      }
    });

    const data = await resp.json();

    if (resp.status === 200) {
      toast.success("Deleted successfully");
      await getPosts(); // refresh posts
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error("Network error");
    console.error(err);
  }
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
                {(userRole === "admin" || report.author?._id === userId) && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePost(report._id)}
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
