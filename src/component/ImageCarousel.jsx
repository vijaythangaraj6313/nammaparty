// src/component/ImageCarousel.jsx

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageCarousel.css'; // We will create this CSS file next

// Import Firestore functionality
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        // Fetch documents from the "carousel" collection
        const querySnapshot = await getDocs(collection(db, 'carousel'));
        const imageData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imageData);
      } catch (error) {
        console.error("Error fetching carousel images: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, []); // Empty dependency array means this runs once on component mount

  // Settings for the react-slick carousel
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the slider
    speed: 500, // Animation speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto-sliding
    autoplaySpeed: 3000, // Time between slides in ms (3 seconds)
  };

  if (loading) {
    return <div className="carousel-loading">Loading...</div>;
  }

  return (
    <div className="image-carousel-slider">
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id}>
            {/* The document field containing the URL is named "image" */}
            <img src={image.image} alt="carousel slide" className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;