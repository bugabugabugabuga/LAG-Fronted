import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Competition.css";

const API_URL = import.meta.env.VITE_SERVER_URL;

export default function Competition() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const joinCompetition = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/competition/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      navigate("/Leaderboard");
    } catch (err) {
      alert("Join failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>
      <button onClick={joinCompetition} disabled={loading}>
        {loading ? "Joining..." : "Join Competition"}
      </button>
    </div>
  );
}
