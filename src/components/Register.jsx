import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Sign-up</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[400px] gap-2"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          className="border-2 border-black p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-black p-2"
        />
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-2 border-black p-2"
        />

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white"
        >
          {loading ? "Loading..." : "Sign-up"}
        </button>

        <h2>
          Already have an account? <Link to="/sign-in">Sign-in</Link>
        </h2>
      </form>
    </div>
  );
}
