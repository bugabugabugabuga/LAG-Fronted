import { useNavigate } from "react-router-dom";
import "./Competition.css";

const Competition = () => {
  const navigate = useNavigate();

  const handleEnterCompetition = () => {
    navigate("/leaderboard"); // Go straight to leaderboard
  };

  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>

      <div className="competition-card">
        <p>Entry Fee: <strong>FREE</strong></p>
        <button
          className="enter-btn"
          onClick={handleEnterCompetition}
        >
          Enter Competition
        </button>
      </div>
    </div>
  );
};

export default Competition;
