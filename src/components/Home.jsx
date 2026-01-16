import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Home.css";
import { toast } from "react-toastify";
import { UserContext } from "../context/user-provider";
import cameraIcon from "../assets/camera.png";
import { ThumbsUp } from "lucide-react";
import ImageCarousel from "../components/ImageCarousel";
import { addLikeToUser } from "../utils/leaderboard.js";


const Home = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [afterError, setAfterError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { user, setUser } = useContext(UserContext);
  const token = Cookies.get("token");

  const MAX_AFTER_PHOTOS = 10;
  const MIN_AFTER_PHOTOS = 3;

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
      if (currentReport) {
        const updated = res.data.find((r) => r._id === currentReport._id);
        if (updated) setCurrentReport(updated);
      }
    } catch (err) {
      console.error("Failed fetching reports:", err);
      setReports([]);
    }
  };

  // ---------------------- HANDLE REACTIONS ----------------------
  const handleReaction = async (type, id) => {
  try {
    const resp = await fetch(`${SERVER_URL}/posts/${id}/reactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      console.error(err);
      return;
    }

    // 🔑 FIND THE REPORT THAT WAS LIKED
    const likedReport = reports.find((r) => r._id === id);

    // 🔑 ONLY ADD TO LEADERBOARD IF:
    // 1) reaction is "like"
    // 2) report has an author
    // 3) user is competition member
    if (
      type === "like" &&
      likedReport?.author?.fullname &&
      Cookies.get("competitionToken") === "joined"
    ) {
      addLikeToUser(likedReport.author.fullname);
    }

    await fetchReports();
  } catch (err) {
    console.error("Reaction error:", err);
  }
};


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
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
      const newFiles = [];
      for (const file of files) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (existingKeys.has(key)) {
          setAfterError(" You can’t upload the same photo twice.");
          continue;
        }
        if (prev.length + newFiles.length >= MAX_AFTER_PHOTOS) {
          setAfterError("Maximum 10 after photos allowed.");
          break;
        }
        newFiles.push(file);
      }
      if (newFiles.length) setAfterError("");
      return [...prev, ...newFiles];
    });

    e.target.value = "";
  };

const handleSubmitAfterPhotos = async () => {
  if (!token) {
    toast.error("Not logged in");
    return;
  }

  if (selectedFiles.length < MIN_AFTER_PHOTOS) {
    setAfterError("Please upload at least 3 after photos.");
    return;
  }

  setUploading(true);
  setAfterError("");

  try {
    const formData = new FormData();
    selectedFiles.forEach((file) =>
      formData.append("afterImages", file)
    );

    const res = await axios.put(
      `${SERVER_URL}/posts/${currentReport._id}/after-photo`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("After photos uploaded!");

    const updatedPost = res.data.post;

    setReports((prev) =>
      prev.map((r) =>
        r._id === currentReport._id
          ? { ...r, afterImages: updatedPost.afterImages }
          : r
      )
    );

    setCurrentReport({
      ...currentReport,
      afterImages: updatedPost.afterImages,
    });

    setSelectedFiles([]);
  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  } finally {
    setUploading(false); // ✅ ALWAYS resets
  }
};


  const openModal = (report) => {
    setCurrentReport(report);
    setShowModal(true);
    setSelectedFiles([]);
  };

  const sortByLikes = (arr) =>
    [...arr].sort((a, b) => (b.reactions?.likes?.length || 0) - (a.reactions?.likes?.length || 0));

  useEffect(() => {
    fetchCurrentUser();
    fetchReports();
  }, []);

  // ---------------------- HOLD / UNHOLD ----------------------
  const handleHold = async (postId) => {
    if (!token) return toast.error("Not logged in");
    try {
      const res = await axios.put(`${SERVER_URL}/posts/${postId}/hold`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post held for 3 days");
      fetchReports();
    } catch (err) {
      console.error("Hold error:", err.response || err);
      toast.error(err.response?.data?.message || "Hold failed");
    }
  };

  const handleUnhold = async (postId) => {
    if (!token) return toast.error("Not logged in");
    try {
      const res = await axios.put(`${SERVER_URL}/posts/${postId}/unhold`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post unheld");
      fetchReports();
    } catch (err) {
      console.error("Unhold error:", err.response || err);
      toast.error(err.response?.data?.message || "Unhold failed");
    }
  };

  const isHoldActive = (report) => report?.hold?.user && new Date(report.hold.expiresAt) > new Date();
  const isHeldByMe = (report) => report?.hold?.user === userId;

  // ---------------------- SPLIT REPORTS ----------------------
  const needsCleaning = sortByLikes(reports.filter((r) => !r.afterImages?.length));
  const readyToDonate = sortByLikes(reports.filter((r) => r.afterImages?.length));

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
                {(Array.isArray(currentReport.images) && currentReport.images.length > 0) ? (
                  currentReport.images.map((img, i) => (
                    <img key={i} src={img} alt={`before-${i}`} className="modal-photo" />
                  ))
                ) : currentReport.image && (
                  <img src={currentReport.image} alt="before" className="modal-photo" />
                )}
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
              {/* HOLD / UNHOLD */}
              {!currentReport.afterImages?.length && isHoldActive(currentReport) && isHeldByMe(currentReport) && (
                <button onClick={() => handleUnhold(currentReport._id)} className="hold-btn">Unhold</button>
              )}
              {!currentReport.afterImages?.length && (!currentReport.hold?.user || !isHeldByMe(currentReport)) && (
                <button onClick={() => handleHold(currentReport._id)} disabled={isHoldActive(currentReport)} className="hold-btn">
                  {isHoldActive(currentReport) ? "Held by someone else" : "HOLD (3 days)"}
                </button>
              )}

              {/* HOLD INFO */}
              {isHoldActive(currentReport) && (
                <p style={{ color: isHeldByMe(currentReport) ? "green" : "red", fontWeight: "bold" }}>
                  {isHeldByMe(currentReport) ? "Held by you" : "Held by someone else"}
                </p>
              )}

              {/* DISABLE ADD AFTER PHOTO FOR OTHERS */}
              {!isHeldByMe(currentReport) && currentReport.hold?.user && !currentReport.afterImages?.length && (
                <p style={{ color: "red" }}>You can’t add after photos – held by someone else</p>
              )}

              {!currentReport.afterImages?.length && isHeldByMe(currentReport) && (
                <>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setSelectedFiles((prev) => [...prev, ...files]); // append instead of overwrite
                    }}
                    id="afterPhotoInput"
                    style={{ display: "none" }}
                  />

                  <input
  type="file"
  id="afterPhotoInput"
  multiple
  accept="image/*"
  onChange={handleFileChange}
  hidden
/>

<div className="after-grid">
  {selectedFiles.map((file, i) => (
    <div key={i} className="after-box">
      <img
        src={URL.createObjectURL(file)}
        alt={`after-preview-${i}`}
      />
    </div>
  ))}

  {selectedFiles.length < MAX_AFTER_PHOTOS && (
    <label htmlFor="afterPhotoInput" className="after-box after-camera">
      <img src={cameraIcon} alt="Add photo" />
    </label>
  )}
</div>

<small>
  After Photos ({selectedFiles.length}/{MAX_AFTER_PHOTOS}) — min 3
</small> 
                  {afterError && (
  <p className="after-error">
    ❗ {afterError}
  </p>
)}

                  <button
  onClick={handleSubmitAfterPhotos}
  disabled={
    uploading ||
    selectedFiles.length < MIN_AFTER_PHOTOS
  }
>
  {uploading ? "Uploading..." : "Add After Photos"}
</button>

                </>
              )}

              {currentReport.afterImages?.length && user && (
                <button onClick={() => navigate("/donate", { state: { reportId: currentReport._id } })}>
                  Donate
                </button>
              )}

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
              {report.images?.length && <ImageCarousel images={report.images} />}
              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                <p><strong>Author:</strong> {report.author?.fullname}</p>

                {(userRole === "admin" || report.author?._id === userId) && (
                  <button
                    className="mrg"
                    onClick={(e) => { e.stopPropagation(); setDeleteReportId(report._id); setShowDeleteModal(true); }}
                  >
                    Delete
                  </button>
                )}

                <button
                  className="mrg"
                  onClick={(e) => { e.stopPropagation(); handleReaction("like", report._id); }}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ThumbsUp color={report.reactions?.likes?.includes(userId) ? "red" : "gray"} />
                  <span>{report.reactions?.likes?.length || 0}</span>
                </button>

                {/* Hold badge */}
                {isHoldActive(report) && (
                  <span className="hold-badge">{isHeldByMe(report) ? "Held by you" : "Held"}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2>Ready to Donate</h2>
        <div className="report-list">
          {readyToDonate.map((report) => (
            <div key={report._id} className="report-card" onClick={() => openModal(report)}>
              {(report.images?.length || report.afterImages?.length) && (
                <ImageCarousel
                  images={[
                    ...(report.images || []).map((img) => ({ url: img, type: "before" })),
                    ...(report.afterImages || []).map((img) => ({ url: img, type: "after" })),
                  ]}
                />
              )}
              <div className="report-info">
                <h3>{report.descriptione}</h3>
                <p><strong>Location:</strong> {report.Location}</p>
                <p><strong>Author:</strong> {report.author?.fullname}</p>

                {(userRole === "admin" || report.author?._id === userId) && (
                  <button
                    className="mrg"
                    onClick={(e) => { e.stopPropagation(); setDeleteReportId(report._id); setShowDeleteModal(true); }}
                  >
                    Delete
                  </button>
                )}

                <button
                  className="mrg"
                  onClick={(e) => { e.stopPropagation(); handleReaction("like", report._id); }}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ThumbsUp color={report.reactions?.likes?.includes(userId) ? "red" : "gray"} />
                  <span>{report.reactions?.likes?.length || 0}</span>
                </button>

                {isHoldActive(report) && (
                  <span className="hold-badge">{isHeldByMe(report) ? "Held by you" : "Held"}</span>
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
