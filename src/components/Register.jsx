import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./register.css"; // import your external CSS

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const resp = await fetch(
        "https://back-project-olive.vercel.app/auth/sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname, email, password }),
        }
      );

      const data = await resp.json();

      if (resp.status === 201) {
        toast.success("User registered successfully!");
        navigate("/sign-in");
      } else {
        toast.error(data.message || "Registration failed");
        console.log(data);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Sign-up</h1>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />

        <button type="submit" className="register-btn">
          {loading ? "Loading..." : "Sign-up"}
        </button>

        <h2 className="register-footer">
          Already have an account? <Link to="/sign-in">Sign-in</Link>
        </h2>
      </form>
    </div>
  );
}
