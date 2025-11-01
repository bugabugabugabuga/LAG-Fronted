import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadPreset = "unsigned_upload"; // your Cloudinary preset
  const cloudName = "decnvqu6r"; // your Cloudinary cloud name

  const email = localStorage.getItem("email"); // current logged-in user

  // Load saved image for this user
  useEffect(() => {
    if (email) {
      const savedImage = localStorage.getItem(`profileImage_${email}`);
      if (savedImage) setImageUrl(savedImage);
    }
  }, [email]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const newImageUrl = res.data.secure_url;
      setImageUrl(newImageUrl);

      // Save per user
      localStorage.setItem(`profileImage_${email}`, newImageUrl);

      // Notify Header to update immediately
      window.dispatchEvent(new Event("profileImageChanged"));
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Failed to upload image. Check preset or cloud name.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <div className="profile-pic">
          {imageUrl ? <img src={imageUrl} alt="Profile" /> : <p>No photo yet</p>}
        </div>
        <label className="upload-btn">
          {uploading ? "Uploading..." : "Change Photo"}
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
      </div>
    </div>
  );
};

export default Profile;
