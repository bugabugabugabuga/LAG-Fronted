import React, { useState, useEffect, useContext } from "react";
import "./Report.css";
import cameraIcon from "../assets/camera.png";
import Cookies from "js-cookie";
import { UserContext } from "../context/user-provider";

function Report() {
  const { user, setUser } = useContext(UserContext);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Sync user context on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (user) return; // already in context

      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch("https://back-project-olive.vercel.app/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data); // update context so header shows logged-in state
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [user, setUser]);

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile || !description || !location)
      return alert("All fields are required!");

    const token = Cookies.get("token");
    if (!token) return alert("You must be logged in to submit a report.");

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
        alert("Report created successfully!");

        // Reset form and preview to camera icon
        setPhotoFile(null);
        setPhotoPreview(null);
        setDescription("");
        setLocation("");
        document.getElementById("photoInput").value = "";
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
        {/* Image Upload */}
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

        {/* Description */}
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

        {/* Location */}
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
