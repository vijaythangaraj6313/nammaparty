import React, { useState, useEffect } from 'react';
import './HeroSlider.css'; // Changed CSS import name
import image1 from '../images/pomegranate.png';
import image2 from '../images/vegetables.png';
import image3 from '../images/vegetables-in-basket.png';

const slides = [
  {
    image: image1,
    alt: 'Fresh pomegranates'
  },
  {
    image: image2,
    alt: 'Assortment of fresh vegetables'
  },
  {
    image: image3,
    alt: 'Basket full of fresh vegetables'
  }
];

// Renamed component from ImageCarousel to HeroSlider
const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [currentIndex]);

  return (
    <div className="carousel-wrapper">
      <div className="carousel-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="carousel-slide-item" key={index}>
            <div className="slide-text-content">
              <span className="organic-tag">100% ORGANIC PRODUCT</span>
              <h1 className="slide-headline">
                Buy Delicious produce Enjoy Free Shipping
              </h1>
              <button className="buy-now-btn">BUY NOW &gt;</button>
            </div>
            <div className="slide-image-content">
              <img src={slide.image} alt={slide.alt} className="slide-image" />
              <div className="sale-sticker">
                <span className="sale-text">Sale Up To</span>
                <span className="sale-percent">30%</span>
                <span className="sale-off">OFF</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; // Changed export name