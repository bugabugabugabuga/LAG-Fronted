import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ REQUIRED
import Cookies from "js-cookie";
import { UserContext } from "../context/user-provider.jsx";
import "./Competition.css";

const API_URL = import.meta.env.VITE_SERVER_URL;

const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleEnterCompetition = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const token = Cookies.get("token");

      const res = await axios.post(
        `${API_URL}/competition/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ SET COOKIE ONLY AFTER BACKEND CONFIRMS JOIN
      Cookies.set("competitionToken", "joined", {
        expires: 7,
        path: "/",
      });

      navigate("/Leaderboard");
    } catch (err) {
      console.error("Join failed:", err);
      alert("Join failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>

      <div className="competition-card">
        <p>
          Entry Fee: <strong>FREE</strong>
        </p>

        <button
          className="enter-btn"
          onClick={handleEnterCompetition}
          disabled={loading}
        >
          {loading ? "Joining..." : "Enter Competition"}
        </button>
      </div>
    </div>
  );
};

export default Competition;
