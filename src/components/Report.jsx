import React, { useState, useEffect } from "react";
import "./Report.css";
import cameraIcon from "../assets/camera.png";

function Report() {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Handle Google OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/Report");
    }
  }, []);

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo || !description || !location) return alert("All fields are required!");

    const formData = new FormData();
    formData.append("image", photo);
    formData.append("descriptione", description);
    formData.append("Location", location);

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to submit a report.");

    try {
      const res = await fetch("https://back-project-olive.vercel.app/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.status === 201) {
        alert("Report created successfully!");
        setPhoto(null);
        setDescription("");
        setLocation("");
      } else {
        alert(data.message || "Error creating report");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="report-container">
      <h2>Report a Trash Spot</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Before Photo</label>
          <div className="photo-upload">
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <label htmlFor="photoInput">
              <img src={cameraIcon} alt="Upload" className="camera-icon" />
            </label>
            {photo && <span>Selected: {photo.name}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            placeholder="Describe the trash spot..."
          />
          <small>{description.length}/500 characters</small>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address or landmark"
          />
        </div>

        <button type="submit" className="reportBTN">
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default Report;
