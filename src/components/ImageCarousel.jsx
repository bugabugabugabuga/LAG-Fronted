import React, { useState } from "react";
import "./ImageCarousel.css";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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

  console.log("Carousel images:", images);

  return (
    <div className="carousel">
      <img
        src={
          images[currentIndex].startsWith("http")
            ? images[currentIndex]
            : `${SERVER_URL}/${images[currentIndex]}`
        }
        alt={`Slide ${currentIndex + 1}`}
        className="carousel-image"
      />

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
    </div>
  );
};

export default ImageCarousel;
