import React from 'react';
import './Footer.css';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Left Side */}
        <div className="footer-left">
          <h3 className="footer-title">Namma Party</h3>
          <p className="footer-about">
            Discover the freshest produce, handpicked daily to bring quality and taste straight to your kitchen. 
            Enjoy seamless online shopping with us, where every order is a promise of health and happiness for your family.
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <h3 className="footer-title">Contact Us</h3>
          <p className="contact-address">
 41-46 2nd Floor, 7th Street, Tatabad, Coimbatore, Tamil Nadu 641012
         </p>
          <p className="contact-phone">
Phone: 086670 45244           </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;