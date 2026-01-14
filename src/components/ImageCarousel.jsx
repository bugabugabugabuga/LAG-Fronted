import React, { useState } from "react";
import "./ImageCarousel.css";

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  if (!Array.isArray(images) || images.length === 0) return null;

  const current = images[currentIndex];

  const imageUrl =
    typeof current === "string"
      ? current.startsWith("http")
        ? current
        : `${SERVER_URL}/${current}`
      : current.url.startsWith("http")
      ? current.url
      : `${SERVER_URL}/${current.url}`;

  const label =
    typeof current === "object" ? current.type : "before";

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="carousel">
      <div className="carousel-image-wrapper">
        <span className={`carousel-label ${label}`}>
          {label.toUpperCase()}
        </span>

        <img
          src={imageUrl}
          alt={`${label}-${currentIndex}`}
          className="carousel-image"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            className="carousel-btn left"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
          >
            &#10094;
          </button>

          <button
            className="carousel-btn right"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
