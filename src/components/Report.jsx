import React, { useState } from "react";
import "./Report.css";
import cameraIcon from "../assets/camera.png";

function Report() {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !description || !location) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("image", photo);
    formData.append("description", description); // FIXED: correct field name
    formData.append("Location", location);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://back-project-olive.vercel.app/posts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 201) {
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
      <p>
        Help your community by reporting areas that need cleanup. Your report
        will help volunteers find and address environmental issues.
      </p>

      <div className="new-report">
        <h3>New Report</h3>
        <p>
          Provide details about the trash spot to help volunteers understand the
          situation.
        </p>

        <form onSubmit={handleSubmit} className="report-form">
          {/* PHOTO */}
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

              {photo && (
                <span className="photo-name">Selected: {photo.name}</span>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="brd"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Describe what type of trash, how much, and any safety concerns..."
            />
            <small>{description.length}/500 characters</small>
          </div>

          {/* LOCATION */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter address or landmark (e.g., Central Park, near main entrance)"
            />
          </div>

          <button type="submit" className="reportBTN">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Report;
