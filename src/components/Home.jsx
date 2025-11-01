import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Home.css";
import ImageCarousel from "./ImageCarousel";

const Home = () => {
  const navigate = useNavigate(); 

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedReportTitle, setSelectedReportTitle] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const openDonateModal = (title) => {
    setSelectedReportTitle(title);
    setShowDonateModal(true);
  };

  const closeDonateModal = () => {
    setShowDonateModal(false);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    const amount = selectedAmount || customAmount;
    if (!amount) return alert("Please enter or select an amount.");
    alert(`Thank you for donating $${amount} to "${selectedReportTitle}"!`);
    closeDonateModal();
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>
            Report trash spots, volunteer for cleanups, and support environmental heroes.
            Together we create cleaner, healthier communities one spot at a time.
          </p>
          <div className="hero-buttons">
            <button
              className="report-btn"
              onClick={() => navigate("/Report")} 
            >
              Report Trash Spot
            </button>

            <button
              className="join-btn"
              onClick={() => navigate("/CleanUp")} 
            >
              Join Cleanup
            </button>
          </div>
        </div>
      </section>

      <section className="stats">
        <p className="subtitle">COMMUNITY VOLUNTEERS CLEANING UP THE ENVIRONMENT</p>
        <h2>3 Active Reports</h2>
      </section>

      <section className="feed">
        <h2 className="cf">Community Feed</h2>
        <p className="filter">All • Need Cleanup • Cleaned</p>

        <div className="report-list">
          <div className="report-card">
            <ImageCarousel
              images={[
                "https://www.quickwasters.co.uk/wp-content/uploads/2023/05/Most-Common-Littered-Items.jpg",
                "https://19january2017snapshot.epa.gov/sites/production/files/styles/medium/public/2016-04/trash-parking-lot.jpg"
              ]}
            />
            <div className="report-info">
              <h3>
                Large pile of plastic bottles and food containers left near the hiking trail entrance.
              </h3>
              <p>
                <strong>Location:</strong> Central Park, Trail Entrance <br />
                Reported: 1/15/2025 • Cleaned: 1/18/2025
              </p>
              <p className="donations">12 donations</p>
              <button
                className="donate-btn"
                onClick={() =>
                  openDonateModal(
                    "Large pile of plastic bottles and food containers left near the hiking trail entrance."
                  )
                }
              >
                Donate
              </button>
            </div>
          </div>

          <div className="report-card">
            <ImageCarousel
              images={[
                "https://www.quickwasters.co.uk/wp-content/uploads/2023/05/Most-Common-Littered-Items.jpg",
                "https://19january2017snapshot.epa.gov/sites/production/files/styles/medium/public/2016-04/trash-parking-lot.jpg"
              ]}
            />
            <div className="report-info">
              <h3>
                Large pile of plastic bottles and food containers left near the hiking trail entrance.
              </h3>
              <p>
                <strong>Location:</strong> Central Park, Trail Entrance <br />
                Reported: 1/15/2025 • Cleaned: 1/18/2025
              </p>
              <p className="donations">15 donations</p>
              <button
                className="donate-btn"
                onClick={() =>
                  openDonateModal(
                    "Large pile of plastic bottles and food containers left near the hiking trail entrance."
                  )
                }
              >
                Donate
              </button>
            </div>
          </div>

          <div className="report-card">
            <ImageCarousel
              images={[
                "https://www.quickwasters.co.uk/wp-content/uploads/2023/05/Most-Common-Littered-Items.jpg",
                "https://19january2017snapshot.epa.gov/sites/production/files/styles/medium/public/2016-04/trash-parking-lot.jpg"
              ]}
            />
            <div className="report-info">
              <h3>
                Large pile of plastic bottles and food containers left near the hiking trail entrance.
              </h3>
              <p>
                <strong>Location:</strong> Central Park, Trail Entrance <br />
                Reported: 1/15/2025 • Cleaned: 1/18/2025
              </p>
              <p className="donations">10 donations</p>
              <button
                className="donate-btn"
                onClick={() =>
                  openDonateModal(
                    "Large pile of plastic bottles and food containers left near the hiking trail entrance."
                  )
                }
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      </section>

      {showDonateModal && (
        <div className="modal-overlay" onClick={closeDonateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="dtsc">Donate to Support Cleanup</h2>
            <p>{selectedReportTitle}</p>
            <div className="preset-amounts">
              {[5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  className={selectedAmount === amt ? "selected" : ""}
                  onClick={() => handleAmountSelect(amt)}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <label className="ca">Custom Amount: </label>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="Enter your amount"
              />
            </div>
            <div className="modal-buttons">
              <button className="donate-confirm" onClick={handleDonate}>
                Donate
              </button>
              <button className="donate-cancel" onClick={closeDonateModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
