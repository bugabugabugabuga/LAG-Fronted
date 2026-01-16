import { useState } from "react";
import Cookies from "js-cookie";
import "./Competition.css";

const API_URL = import.meta.env.VITE_SERVER_URL;

const Competition = () => {
  const [loading, setLoading] = useState(false);

  const handleEnterCompetition = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/competition/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to join competition");
        return;
      }

      // refresh app state
      window.location.reload();
    } catch (err) {
      console.error("Join competition error:", err);
      alert("Network error");
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
