import React, { useState } from 'react';
import './ContactUs.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
// Import your Firebase instance (db) and Firestore functions
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactUs = () => {
  // The address to display on the page
  const officeAddress = "41-46 2nd Floor, 7th Street, Tatabad, Coimbatore, Tamil Nadu 641012";

  // State to manage form inputs and submission status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Function to update state when user types in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser from reloading
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add a new document with the form data to the "userreview" collection
      await addDoc(collection(db, "userreview"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp() // Adds a server-side timestamp
      });

      // Clear the form and show a success message
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('success');
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* --- Top Banner Section --- */}
      <section className="contact-page-banner">
        <p className="banner-breadcrumb">Home / Contact Us</p>
        <h1 className="banner-title">Contact Us</h1>
      </section>

      {/* --- Main Content Section --- */}
      <main className="main-contact-content">
        {/* Left Column */}
        <div className="left-contact-column">
          <h2 className="contact-info-title">Contact Information</h2>
          <p className="contact-info-subtitle">Fill the form below or write us. We will help you as soon as possible.</p>
          
          <div className="info-cards-container">
            <div className="info-card">
              <div className="info-card-icon"><FaPhoneAlt /></div>
              <h3 className="info-card-title">Phone</h3>
              <p className="info-card-text">+1347-430-9510</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon"><FaEnvelope /></div>
              <h3 className="info-card-title">Email</h3>
              <p className="info-card-text">abdur.rohman2003@gmail.com</p>
            </div>
          </div>

          <div className="address-map-card">
            <div className="address-header">
                <div className="address-icon"><FaMapMarkerAlt /></div>
                <div className="address-details">
                    <h3 className="info-card-title">Address</h3>
                    <p className="info-card-text">{officeAddress}</p>
                </div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.273934399209!2d76.9535384748083!3d11.017558354673656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859b33a511e69%3A0xf6218d693f1352e6!2s41-46%2C%207th%20St%2C%20Tatabad%2C%20Coimbatore%2C%20Tamil%20Nadu%20641012%2C%20India!5e0!3m2!1sen!2sus!4v1678887123456!5m2!1sen!2sus"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location in Coimbatore">
              </iframe>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-contact-column">
          <h2 className="get-in-touch-title">Get In Touch</h2>
          <form className="contact-form-panel" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input type="text" id="name" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input type="email" id="email" name="email" placeholder="user@gmail.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject*</label>
              <input type="text" id="subject" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message*</label>
              <textarea id="message" name="message" placeholder="Write Message........." rows="6" required value={formData.message} onChange={handleChange}></textarea>
            </div>
            
            {/* Display success or error messages to the user */}
            {submitStatus === 'success' && <p className="submit-message success">Your message has been sent successfully!</p>}
            {submitStatus === 'error' && <p className="submit-message error">Failed to send message. Please try again.</p>}

            <button type="submit" className="send-now-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Now'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;