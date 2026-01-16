import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Competition.css";

const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnterCompetition = () => {
    setLoading(true);
    // Directly navigate to leaderboard page
    navigate("/leaderboard");
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
          {loading ? "Redirecting..." : "Enter Competition"}
        </button>
      </div>
    </div>
  );
};

export default Competition;
