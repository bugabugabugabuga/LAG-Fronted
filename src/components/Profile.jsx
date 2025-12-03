import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Profile.css";
import { UserContext } from "../context/user-provider";
import Cookies from "js-cookie";


const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const uploadPreset = "unsigned_upload";
  const cloudName = "decnvqu6r";
  const token = Cookies.get("token"); 


  // Wait for user from context or fetch it
  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setName(user.fullname || "");
        setImageUrl(user.avatar || "");
        setLoading(false);
        return;
      }

      if (!token) return setLoading(false);

      try {
        const res = await axios.get("https://back-project-olive.vercel.app/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.fullname || "");
        setImageUrl(res.data.avatar || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, user, setUser]);

  const handleImageChange = async (e) => {
    if (!user) return;

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

      await axios.put(
        "https://back-project-olive.vercel.app/api/users",
        { avatar: newImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(prev => prev ? { ...prev, avatar: newImage } : prev);
      window.dispatchEvent(new CustomEvent("profileImageChanged", { detail: newImage }));
      setMessage("Profile image updated");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveName = async () => {
    if (!name) return setMessage("Name cannot be empty");
    if (!user) return;

    try {
      await axios.put(
        "https://back-project-olive.vercel.app/api/users",
        { fullname: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(prev => prev ? { ...prev, fullname: name } : prev);
      window.dispatchEvent(new CustomEvent("profileNameChanged", { detail: name }));
      setMessage("Name updated");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save name");
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-wrapper">
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

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default Profile;
