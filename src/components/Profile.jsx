import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadPreset = "unsigned_upload";
  const cloudName = "decnvqu6r";

  const email = localStorage.getItem("email");

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://back-project-olive.vercel.app/models/users.model/${fullname}`
        );

        setName(res.data.name || "");
        setImageUrl(res.data.profileImage || "");
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    if (email) fetchUser();
  }, [email]);

  // Upload new profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const newImage = uploadRes.data.secure_url;
      setImageUrl(newImage);

      // Save to MongoDB
      await axios.put("https://back-project-olive.vercel.app/api/user/update", {
        email,
        profileImage: newImage,
      });

      // Update header image immediately
      window.dispatchEvent(new Event("profileImageChanged"));
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Save text name
  const saveName = async () => {
    try {
      await axios.put("https://back-project-olive.vercel.app/api/user/update", {
        email,
        name,
      });

      alert("Name saved!");
    } catch (err) {
      alert("Failed to save name");
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
