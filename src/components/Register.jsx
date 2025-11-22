import React, { useState } from "react";
import "./Login.css";
import Google from "../assets/google.png";

export default function Register() {
  const [accountType, setAccountType] = useState("volunteer");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState(""); // <-- added

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // reset error

    try {
      const response = await fetch(
        "https://back-project-olive.vercel.app/auth/sign-up",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            accountType: accountType
          })
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        window.location.href = "/login";
      } else {
        setErrorMsg(data.message || "Registration failed"); // show error
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        {/* Error message */}
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <p className="switch-text">
          Already have an account? <a href="/Login">Log in</a>
        </p>

        <button type="submit" className="submit-btn">Register</button>

        <a
          href="https://back-project-olive.vercel.app/auth/google"
          target="_self"
          rel="noopener noreferrer"
        >
          <button type="button" className="google-btn">
            <img src={Google} alt="Google logo" />
            <span>Sign in with Google</span>
          </button>
        </a>
      </form>
    </div>
  );
}
