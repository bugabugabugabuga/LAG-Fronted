import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "./register.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch(
        "https://back-project-olive.vercel.app/auth/sign-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await resp.json();

      if (resp.ok) {
        // ✅ handle raw string or object
        const tokenValue = typeof data === "string" ? data : data.token;
        Cookies.set("token", tokenValue, { expires: 1, sameSite: "strict" });

        if (data.role) {
          Cookies.set("role", data.role, { expires: 1, sameSite: "strict" });
        }

        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
        console.log(data);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login handling
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      Cookies.set("token", token, { expires: 1, sameSite: "strict" });
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
        Don't have an account? <Link to="/Register">Sign-up</Link>
      </h2>
    </div>
  );
}
