import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const uploadPreset = "unsigned_upload"; // Your Cloudinary unsigned preset
  const cloudName = "decnvqu6r"; // Your Cloudinary cloud name

  const token = localStorage.getItem("token"); // Make sure token is saved after login/register

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "https://back-project-olive.vercel.app/api/users/current-user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setName(res.data.fullName || "");
        setImageUrl(res.data.avatar || "");
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Upload new profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);

      // Upload to Cloudinary
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const newImage = uploadRes.data.secure_url;
      setImageUrl(newImage);

      // Update in backend
      await axios.put(
        "https://back-project-olive.vercel.app/api/users",
        { avatar: newImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("profileImageChanged"));
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Save name
  const saveName = async () => {
    if (!name) return alert("Name cannot be empty");

    try {
      await axios.put(
        "https://back-project-olive.vercel.app/users",
        { fullName: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Name saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save name");
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <div className="profile-info">
        <div className="profile-pic">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" />
          ) : (
            <p>No photo yet</p>
          )}
        </div>

        <label className="upload-btn">
          {uploading ? "Uploading..." : "Change Photo"}
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>

        <div className="name-section">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={saveName}>Save Name</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
