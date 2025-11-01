import React, { useState } from "react";
import "./register.css";
import Google from "../assets/google.png";

export default function Register() {
  const [accountType, setAccountType] = useState("volunteer");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          accountType: accountType
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        window.location.href = "/login";
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Create Account</h2>

      <div className="account-type">
        <button
          type="button"
          className={accountType === "volunteer" ? "active" : ""}
          onClick={() => setAccountType("volunteer")}
        >
          Volunteer
        </button>
        <button
          type="button"
          className={accountType === "donator" ? "active" : ""}
          onClick={() => setAccountType("donator")}
        >
          Donator
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
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

        <p className="switch-text">
          Already have an account? <a href="/Login">Log in</a>
        </p>

        <button type="submit" className="submit-btn">Register</button>

        <button className="google-btn">
          <img src={Google} alt="Google logo" />
          <span>Sign in with Google</span>
        </button>

      </form>
    </div>
  );
}