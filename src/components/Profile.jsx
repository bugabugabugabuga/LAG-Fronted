import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me", {
          withCredentials: true, // send cookies for auth
        });

        setFullName(res.data.fullName || "");
        setEmail(res.data.email || "");
        setAvatar(res.data.avatar || "");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      if (file) formData.append("avatar", file);

      await axios.put("/users", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      // Optionally refetch user data to refresh avatar & name
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Avatar section */}
        <div className="profile-pic">
          {avatar ? (
            <img src={avatar} alt="Avatar" width={150} height={150} />
          ) : (
            <p>No photo yet</p>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Name & Email */}
        <div className="profile-info">
          <label>
            Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
