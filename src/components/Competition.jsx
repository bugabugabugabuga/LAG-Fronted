import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Competition.css";
import Leaderboard from "./Leaderboard"; // ✅ import your Leaderboard page

const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnterCompetition = () => {
    setLoading(true);

    // For now, just navigate directly to Leaderboard
    navigate("/leaderboard");

    // Later your friend can add backend API call here
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
