import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ImageCarousel from "./ImageCarousel";
import "./Home.css";
import { toast } from "react-toastify";
import { UserContext } from "../context/user-provider";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);

  // NEW FOR DELETE POPUP
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);

  const { user, setUser } = useContext(UserContext);
  const token = Cookies.get("token");

  // ---------------------- FETCH CURRENT USER ----------------------
  const fetchCurrentUser = async () => {
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
      console.error("Error getting user:", err);
    }
  };

  // ---------------------- FETCH REPORTS ----------------------
  const fetchReports = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/posts");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed fetching reports:", err);
      setReports([]);
    }
  };

  // ---------------------- DELETE POST ----------------------
  const handleDeletePost = async (id) => {
    if (!token) return toast.error("Not logged in");

    try {
      const resp = await fetch(`https://back-project-olive.vercel.app/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      if (resp.ok) {
        toast.success(data.message);
        setReports((prev) => prev.filter((report) => report._id !== id));
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting");
    }
  };

  // Confirm delete modal action
  const confirmDelete = async () => {
    if (!deleteReportId) return;

    await handleDeletePost(deleteReportId);
    setShowDeleteModal(false);
    setDeleteReportId(null);
  };

  // ---------------------- AFTER PHOTO FILE ----------------------
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ---------------------- SUBMIT AFTER PHOTO ----------------------
  const handleSubmitAfterPhoto = async () => {
    if (!selectedFile) return toast.error("No photo selected");
    if (!token) return toast.error("Not logged in");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.put(
        `https://back-project-olive.vercel.app/posts/${currentReportId}/after-photo`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPost = res.data.post;
      const afterImages = updatedPost.afterImages;

      toast.success("After photo added!");

      setReports((prev) =>
        prev.map((report) =>
          report._id === currentReportId
            ? { ...report, afterImages }
            : report
        )
      );

      setSelectedFile(null);
      document.getElementById("afterPhotoInput").value = "";
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }

    setUploading(false);
  };

  // ---------------------- OPEN AFTER PHOTO MODAL ----------------------
  const openUploadModal = (id) => {
    setCurrentReportId(id);
    setShowModal(true);
    setSelectedFile(null);
    const input = document.getElementById("afterPhotoInput");
    if (input) input.value = "";
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  return (
    <div className="home">

      {/* ===================== DELETE CONFIRM MODAL ===================== */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete?</h2>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="clos-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="del-btn" onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== AFTER PHOTO MODAL ===================== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Add After Photo</h2>

            <label htmlFor="afterPhotoInput" className="upload-btn">
              📷 Choose Photo
            </label>

            <input
              type="file"
              id="afterPhotoInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              onClick={handleSubmitAfterPhoto}
              disabled={!selectedFile || uploading}
              className="submit-btn"
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>

            <button onClick={() => setShowModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>Report trash spots, volunteer, & help improve the environment.</p>
          <button className="report-btn" onClick={() => navigate("/Report")}>
            Report Trash Spot
          </button>
        </div>
      </section>

      {/* ===================== FEED ===================== */}
      <section className="feed">
        <h2 className="cf">Community Feed</h2>

        <div className="report-list">
          {reports.length === 0 && <p>No reports yet.</p>}

          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <ImageCarousel
                images={[report.image, ...(report.afterImages || [])]}
              />

              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p>
                  <strong>Location:</strong> {report.Location}
                </p>
                <p>
                  <strong>Author:</strong> {report.author?.fullname}
                </p>

                {/* DELETE BUTTON with modal */}
                {(userRole === "admin" || report.author?._id === userId) && (
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setDeleteReportId(report._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                )}

                {/* ADD AFTER PHOTO BUTTON */}
                {(!report.afterImages || report.afterImages.length === 0) && (
                  <button onClick={() => openUploadModal(report._id)}>
                    Add After Photo
                  </button>
                )}

                {/* DONATE BUTTON */}
                {report.afterImages?.length > 0 && user && (
                  <button
                    className="donate-btn"
                    onClick={() =>
                      navigate("/donate", { state: { reportId: report._id } })
                    }
                  >
                    Donate
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
