import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Report.css";
import cameraIcon from "../assets/camera.png";
import Cookies from "js-cookie";
import { UserContext } from "../context/user-provider";

function Report() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // 🔹 MULTIPLE PHOTOS STATE
  const [photos, setPhotos] = useState([]); // [{ file, preview }]
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

  // ---------------------- HANDLE PHOTO CHANGE ----------------------
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setErrorMessage("");

    // allow re-selecting same file
    e.target.value = "";
  };

  // ---------------------- REMOVE PHOTO ----------------------
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------- SUBMIT REPORT ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photos.length)
      return setErrorMessage("❗ Please upload at least one photo.");
    if (!description)
      return setErrorMessage("❗ Description is required.");
    if (!location)
      return setErrorMessage("❗ Location is required.");

    const token = Cookies.get("token");
    if (!token)
      return setErrorMessage("❗ You must be logged in.");

    setIsLoading(true);

    const formData = new FormData();

    // 🔹 SEND ALL PHOTOS
    photos.forEach((p) => {
      formData.append("image", p.file);
    });

    formData.append("descriptione", description);
    formData.append("Location", location);

    try {
      const res = await fetch(
        "https://back-project-olive.vercel.app/posts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.status === 201) {
        // RESET FORM
        setPhotos([]);
        setDescription("");
        setLocation("");
        setErrorMessage("");

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
        <div className="error-message">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        {/* BEFORE PHOTOS */}
        <div className="form-group">
          <label>Before Photos</label>

          <div className="photo-preview-grid">
            {/* EXISTING PHOTOS */}
            {photos.map((p, index) => (
              <div key={index} className="photo-preview-wrapper">
                <img
                  src={p.preview}
                  alt="preview"
                  className="photo-preview"
                />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => removePhoto(index)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* ADD MORE PHOTOS */}
            <label htmlFor="photoInput" className="photo-upload">
              <img
                src={cameraIcon}
                className="camera-icon"
                alt="upload"
              />
            </label>
          </div>

          <input
            id="photoInput"
            type="file"
            accept="image/*"
            multiple
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

        {/* SUBMIT */}
        <button type="submit" className="reportBTN" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default Report;
