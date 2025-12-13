import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Report.css";
import cameraIcon from "../assets/camera.png";
import Cookies from "js-cookie";
import { UserContext } from "../context/user-provider";

function Report() {
  const navigate = useNavigate();        // ⬅️ Needed for redirect
  const { user, setUser } = useContext(UserContext);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ---------------------- LOAD USER ----------------------
  useEffect(() => {
    if (user) return;

    const token = Cookies.get("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://back-project-olive.vercel.app/api/users/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user, setUser]);

  // ---------------------- HANDLE PHOTO ----------------------
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrorMessage("");
  };

  // ---------------------- SUBMIT REPORT ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!photoFile) return setErrorMessage("❗ Please upload a photo.");
    if (!description) return setErrorMessage("❗ Description is required.");
    if (!location) return setErrorMessage("❗ Location is required.");

    const token = Cookies.get("token");
    if (!token) return setErrorMessage("❗ You must be logged in.");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", photoFile);
    formData.append("descriptione", description);
    formData.append("Location", location);

    try {
      const res = await fetch("https://back-project-olive.vercel.app/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.status === 201) {
        setErrorMessage("");

        // RESET FORM
        setPhotoFile(null);
        setPhotoPreview(null);
        setDescription("");
        setLocation("");
        document.getElementById("photoInput").value = "";

        // ✅ REDIRECT TO HOME FEED
        navigate("/");
      } else {
        setErrorMessage("❗ " + (data.message || "Failed to create report."));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("❗ Server error while submitting report.");
    }

    setIsLoading(false);
  };

  return (
    <div className="report-container">
      <h2>Report a Trash Spot</h2>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div
          style={{
            background: "#ffdddd",
            padding: "10px",
            border: "1px solid red",
            borderRadius: "5px",
            color: "red",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">

        {/* IMAGE INPUT */}
        <div className="form-group">
          <label>Before Photo</label>

          <label htmlFor="photoInput" className="photo-upload">
            {photoPreview ? (
              <img src={photoPreview} className="photo-preview" alt="preview" />
            ) : (
              <img src={cameraIcon} className="camera-icon" alt="upload" />
            )}
          </label>

          <input
            id="photoInput"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrorMessage("");
            }}
            maxLength={500}
            placeholder="Describe the trash spot..."
          />
          <small>{description.length}/500 characters</small>
        </div>

        {/* LOCATION */}
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter address or landmark"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="reportBTN" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default Report;
  