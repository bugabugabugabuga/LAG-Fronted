import React, { useState } from "react";
import "./ImageCarousel.css"

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="carousel-image"
      />
      <button className="carousel-btn left" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-btn right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default ImageCarousel;
