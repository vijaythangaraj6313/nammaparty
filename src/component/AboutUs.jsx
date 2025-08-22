import React from 'react';
import './AboutUs.css';
import { FaClipboardList, FaHandHoldingUsd, FaShippingFast, FaCheckCircle, FaChevronRight } from 'react-icons/fa';

// Placeholder images - replace with your own
import shoppingImage from '../images/shopping.jpeg'; // You'll need to add an image named 'shopping.jpg' to your src/images folder
import deliveryImage from '../images/delivery-man.jpeg'; // You'll need to add an image named 'delivery-man.jpg' to your src/images folder

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* --- Top Banner Section --- */}
      <section className="about-banner">
        <div className="banner-content">
          <p className="breadcrumb">Home / About Us</p>
          <h1 className="page-title">About Us</h1>
        </div>
      </section>

      {/* --- Three-Step Process Section --- */}
      <section className="process-section">
        <div className="process-card">
          <div className="icon-circle">
            <FaClipboardList />
          </div>
          <h3 className="process-title">Choose product</h3>
          <p className="process-description">
            If you are going to use a passage of you need to be sure there isn't anything embarrassing hidden in the middle.
          </p>
        </div>
        <div className="process-card">
          <div className="icon-circle">
            <FaHandHoldingUsd />
          </div>
          <h3 className="process-title">Make Your Payment</h3>
          <p className="process-description">
            Experience hassle-free online shopping with our service! Simply choose the product you want.
          </p>
        </div>
        <div className="process-card">
          <div className="icon-circle">
            <FaShippingFast />
          </div>
          <h3 className="process-title">Fast Delivery</h3>
          <p className="process-description">
            Experience hassle-free online shopping with our service! enjoy fast delivery right to your doorstep.
          </p>
        </div>
      </section>

      {/* --- Know More About Us Section --- */}
      <section className="know-more-section">
        <div className="know-more-container">
          {/* Left Side: Image Collage */}
          <div className="image-collage">
            <img src={shoppingImage} alt="Customer shopping for groceries" className="img-background" />
            <img src={deliveryImage} alt="Delivery person holding a bag of groceries" className="img-foreground" />
          </div>
          {/* Right Side: Text Content */}
          <div className="text-content">
            <h2 className="section-heading">Know More About Us?</h2>
            <p className="section-paragraph">
              It is a long established fact that a reader will be distracted by the readable content of
              a page when looking at its layout. It is a long established fact a that a reader will be
              distracted by the readable content of a page when looking at its layout.
            </p>
            <ul className="features-list">
              <li><FaCheckCircle className="check-icon" /> Complete Sanitization and cleaning of bathroom</li>
              <li><FaCheckCircle className="check-icon" /> when looking at its layout. it is a long established fact</li>
              <li><FaCheckCircle className="check-icon" /> Complete Sanitization and cleaning of bathroom</li>
            </ul>
            <button className="contact-button">
              Contact us <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;