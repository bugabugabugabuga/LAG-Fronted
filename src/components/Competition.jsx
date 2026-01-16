import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Competition.css";
import Leaderboard from "./Leaderboard";

const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>

      <div className="competition-card">
        <p>Entry Fee: <strong>FREE</strong></p>

            <button
    className={`enter-btn ${
      location.pathname === "/Leaderboard" ? "active" : ""
    }`}
    onClick={() => navigate("/Leaderboard")}
  >
    Enter Competition
          {loading ? "Joining..." : "Enter Competition"}
  </button>

      </div>
    </div>
  );
};

export default Competition;
