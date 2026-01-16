import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "../context/user-provider.jsx";
import "./Competition.css";

const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleEnterCompetition = () => {
    if (!user) return;

    setLoading(true);

    // ✅ SET TOKEN ONLY AFTER MANUAL JOIN
    Cookies.set("competitionToken", "joined", {
      expires: 7,
      path: "/",
    });

    navigate("/Leaderboard");
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
