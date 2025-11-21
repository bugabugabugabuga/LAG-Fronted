import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ImageCarousel from "./ImageCarousel";

const Home = () => {
  const navigate = useNavigate();

  // FETCHED REPORTS
  const [reports, setReports] = useState([]);

  // DONATION MODAL
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedReportTitle, setSelectedReportTitle] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  // LOAD REPORTS FROM BACKEND
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          "https://back-project-olive.vercel.app/posts"
        );
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const openDonateModal = (title) => {
    setSelectedReportTitle(title);
    setShowDonateModal(true);
  };

  const closeDonateModal = () => {
    setShowDonateModal(false);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const handleAmountSelect = (amt) => {
    setSelectedAmount(amt);
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
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Community</h1>
          <p>
            Report trash spots, volunteer for cleanups, and support environmental
            heroes.
          </p>

          <div className="hero-buttons">
            <button className="report-btn" onClick={() => navigate("/Report")}>
              Report Trash Spot
            </button>

            <button className="join-btn" onClick={() => navigate("/CleanUp")}>
              Join Cleanup
            </button>
          </div>
        </div>
      </section>

      {/* COMMUNITY FEED */}
      <section className="feed">
        <h2 className="cf">Community Feed</h2>
        <p className="filter">All • Need Cleanup • Cleaned</p>

        <div className="report-list">
          {reports.length === 0 && (
            <p className="no-reports">No reports yet. Be the first!</p>
          )}

          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <ImageCarousel images={[report.imageUrl]} />

              <div className="report-info">
                <h3>{report.description}</h3>

                <p>
                  <strong>Location:</strong> {report.Location} <br />
                  Reported:{" "}
                  {new Date(report.createdAt).toLocaleDateString("en-US")}
                </p>

                <p className="donations">
                  {report.donations || 0} donations
                </p>

                <button
                  className="donate-btn"
                  onClick={() => openDonateModal(report.description)}
                >
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DONATION MODAL */}
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
