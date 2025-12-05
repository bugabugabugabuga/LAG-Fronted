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
  const { user, setUser } = useContext(UserContext);
  const token = Cookies.get('token');

  const [showAfterPhotoModal, setShowAfterPhotoModal] = useState(false);
  const [afterPhotoFile, setAfterPhotoFile] = useState(null);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(null);

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

  const fetchReports = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/posts");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    }
  };

  const handleDeletePost = async (id) => {
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json();

      if (resp.ok) {
        toast.success(data.message);
        await fetchReports(); 
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      toast.error("Network error");
    }
  };

  const handleAfterPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAfterPhotoFile(file);
    setAfterPhotoPreview(URL.createObjectURL(file));
  };

  const handleAfterPhotoUpload = async () => {
    if (!afterPhotoFile) return toast.error("Please select a photo");

    const formData = new FormData();
    formData.append("file", afterPhotoFile);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET"); // replace with your preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", { // replace with your cloud name
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.secure_url;

      // Update backend
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/posts/${currentReportId}/after-photo`,
        { afterImage: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("After photo uploaded!");

      // Optimistically update frontend so carousel shows immediately
      setReports((prev) =>
        prev.map((r) =>
          r._id === currentReportId ? { ...r, afterImage: imageUrl } : r
        )
      );

      setShowAfterPhotoModal(false);
      setAfterPhotoFile(null);
      setAfterPhotoPreview(null);
      setCurrentReportId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo");
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
              <ImageCarousel images={[report.image, report.afterImage].filter(Boolean)} />
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

                {/* After Photo Button */}
                <button
                  className="report-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    setCurrentReportId(report._id);
                    setShowAfterPhotoModal(true);
                  }}
                >
                  Add After Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* After Photo Modal */}
      {showAfterPhotoModal && (
        <div
          className="afterPhoto-modal"
          onClick={() => setShowAfterPhotoModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Upload After Photo</h3>

            {afterPhotoPreview && (
              <img src={afterPhotoPreview} alt="preview" style={{ width: "100%", marginBottom: "10px" }} />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleAfterPhotoChange}
            />

            <button
              className="report-btn"
              style={{ marginTop: "10px" }}
              onClick={handleAfterPhotoUpload}
            >
              Upload
            </button>
            <button
              className="report-btn"
              style={{ marginTop: "10px", backgroundColor: "gray" }}
              onClick={() => setShowAfterPhotoModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
