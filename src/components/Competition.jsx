import { useState } from "react";
import Cookies from "js-cookie";
// import { API_URL } from "../config/api";
import "./Competition.css";
const API_URL = import.meta.env.VITE_SERVER_URL;


const ENTRY_CENTS = 299; // $2.99

const Competition = () => {
  const [loading, setLoading] = useState(false);

  const handleEnterCompetition = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/stripe/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          productName: "Competition Entry Fee",
          amount: ENTRY_CENTS,
          description: "Entry to CleanQuest competition",
          type: "competition", // 🔑 THIS IS THE KEY
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert(data.message || "Failed to start payment");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Competition checkout error:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>

      <div className="competition-card">
        <p>Entry Fee: <strong>$2.99</strong></p>

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
