import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "./register.css"; // using the same CSS as signup

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const resp = await fetch(
        "https://back-project-olive.vercel.app/auth/sign-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await resp.json();

      if (resp.status === 200) {
        Cookies.set("token", data.token, { expires: 1 }); // expires in 1 day
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
        console.log(data);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      Cookies.set("token", token, { expires: 1 }); // 1 day
      toast.success("Logged in successfully");
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="register-container">
      <h1 className="register-title">Sign-in</h1>

      <form onSubmit={handleSubmit} className="register-form">
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
          {loading ? "Loading..." : "Sign-in"}
        </button>
      </form>

      <Link
        className="register-google-link"
        to="https://back-project-olive.vercel.app/auth/google"
      >
        Continue with Google
      </Link>

      <h2 className="register-footer">
        Don't have an account? <Link to="/sign-up">Sign-up</Link>
      </h2>
    </div>
  );
}
