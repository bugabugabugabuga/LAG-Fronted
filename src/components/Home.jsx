import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Home.css";
import { toast } from "react-toastify";
import { UserContext } from "../context/user-provider";
import cameraIcon from "../assets/camera.png";
import { ThumbsUp } from "lucide-react";

// ... all imports stay the same
const Home = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);

  const { user, setUser } = useContext(UserContext);
  const token = Cookies.get("token");

  // ---------------------- FETCH CURRENT USER ----------------------
  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${SERVER_URL}/auth/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(res.data.role);
      setUserId(res.data._id);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------- FETCH REPORTS ----------------------
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/posts`);
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed fetching reports:", err);
      setReports([]);
    }
  };

  // ---------------------- HANDLE REACTIONS ----------------------
      const handleReaction = async (type, id) => {
        const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${id}/reactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                type: type
            })
        })
        if (resp.status === 200) {
            await getPosts()
        }
    }


  // ---------------------- DELETE POST ----------------------
  const handleDeletePost = async (id) => {
    if (!token) return toast.error("Not logged in");
    try {
      const resp = await fetch(`${SERVER_URL}/posts/${id}`, {
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
  const confirmDelete = async () => {
    if (!deleteReportId) return;
    await handleDeletePost(deleteReportId);
    setShowDeleteModal(false);
    setDeleteReportId(null);
  };

  // ---------------------- AFTER PHOTO UPLOAD ----------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFiles(file ? [file] : []);
  };

  const handleSubmitAfterPhotos = async () => {
    if (!selectedFiles.length) return toast.error("No photo selected");
    if (!token) return toast.error("Not logged in");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFiles[0]);
      const res = await axios.put(
        `${SERVER_URL}/posts/${currentReport._id}/after-photo`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPost = res.data.post;
      toast.success("After photo added!");
      setReports((prev) =>
        prev.map((report) =>
          report._id === currentReport._id
            ? { ...report, afterImages: updatedPost.afterImages }
            : report
        )
      );
      setCurrentReport({ ...currentReport, afterImages: updatedPost.afterImages });
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const openModal = (report) => {
    setCurrentReport(report);
    setShowModal(true);
    setSelectedFiles([]);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  // ---------------------- SPLIT REPORTS ----------------------
  const needsCleaning = reports.filter((r) => !r.afterImages?.length);
  const readyToDonate = reports.filter((r) => r.afterImages?.length);

  return (
    <div className="home">
      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Are you sure you want to delete?</h2>
            <div className="modal-btns">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={confirmDelete}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showModal && currentReport && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{currentReport.descriptione}</h2>
            <p><strong>Location:</strong> {currentReport.Location}</p>
            <p><strong>Author:</strong> {currentReport.author?.fullname}</p>

            <div className="modal-photos">
              <div>
                <h4>Before</h4>
                {Array.isArray(currentReport.images)
                  ? currentReport.images.map((img, i) => <img key={i} src={img} alt="before" className="modal-photo" />)
                  : <img src={currentReport.image} alt="before" className="modal-photo" />}
              </div>
              {currentReport.afterImages?.length > 0 && (
                <div>
                  <h4>After</h4>
                  {currentReport.afterImages.map((img, i) => (
                    <img key={i} src={img} alt="after" className="modal-photo" />
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {/* SHOW ADD AFTER PHOTO ONLY IF report HAS NO afterImages */}
              {!currentReport.afterImages?.length && (
                <>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="afterPhotoInput"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="afterPhotoInput" className="after-photo-upload">
                    {selectedFiles.length
                      ? selectedFiles.map((file, i) => <img key={i} src={URL.createObjectURL(file)} className="after-preview" alt="preview" />)
                      : <img src={cameraIcon} alt="camera" className="after-camera-icon" />}
                  </label>
                  <button onClick={handleSubmitAfterPhotos} disabled={!selectedFiles.length || uploading}>
                    {uploading ? "Uploading..." : "Add After Photo"}
                  </button>
                </>
              )}

              {/* DONATE BUTTON */}
              {currentReport.afterImages?.length > 0 && user && (
                <button onClick={() => navigate("/donate", { state: { reportId: currentReport._id } })}>
                  Donate
                </button>
              )}

              {/* DELETE BUTTON */}
              {(userRole === "admin" || currentReport.author?._id === userId) && (
                <button onClick={() => handleDeletePost(currentReport._id)}>Delete</button>
              )}
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>Report trash spots, volunteer, & help improve the environment.</p>
          <button className="rpts" onClick={() => navigate("/Report")}>Report Trash Spot</button>
        </div>
      </section>

      {/* FEED */}
      <section className="feed">
        <h2>Needs Cleaning</h2>
        <div className="report-list">
          {needsCleaning.map((report) => (
            <div key={report._id} className="report-card" onClick={() => openModal(report)}>
              {report.image && <img src={report.image} alt="before" className="report-img" />}
              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                <p><strong>Author:</strong> {report.author?.fullname}</p>

                {(userRole === "admin" || report.author?._id === userId) && (
                  <button className="mrg" onClick={(e) => { e.stopPropagation(); setDeleteReportId(report._id); setShowDeleteModal(true); }}>Delete</button>
                )}
                 <div className='mt-2'>
                            <button onClick={() => handleReaction('like', el._id)}>
                                <ThumbsUp />
                                {el.reactions?.likes?.length}
                            </button>
                            <button onClick={() => handleReaction('dislike', el._id)}>
                                <ThumbsDown className='stroke-red-500' />
                                {el.reactions?.dislikes?.length}
                            </button>
                        </div>
              </div>
            </div>
          ))}
        </div>

        <h2>Ready to Donate</h2>
        <div className="report-list">
          {readyToDonate.map((report) => (
            <div key={report._id} className="report-card" onClick={() => openModal(report)}>
              {report.image && <img src={report.image} alt="before" className="report-img" />}
              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                <p><strong>Author:</strong> {report.author?.fullname}</p>

                {(userRole === "admin" || report.author?._id === userId) && (
                  <button className="mrg" onClick={(e) => { e.stopPropagation(); setDeleteReportId(report._id); setShowDeleteModal(true); }}>Delete</button>
                )}
                <button className="mrg" onClick={(e) => { e.stopPropagation(); handleReaction(report._id); }} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ThumbsUp color={report.reactions?.likes?.includes(userId) ? "red" : "gray"} />
                  <span>{report.reactions?.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
