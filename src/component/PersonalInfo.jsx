// src/component/PersonalInfo.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './PersonalInfo.css'; // We will create this CSS file next

const PersonalInfo = ({ userData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    // Add other fields as needed
  });

  // When userData is fetched, populate the form
  useEffect(() => {
    if (userData) {
      // Assuming 'name' is a full name, let's split it.
      const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: userData.mobile || '',
        address: userData.address || '', // Add address if you store it
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
        alert("You must be logged in to update your profile.");
        return;
    }

    const userDocRef = doc(db, 'customers', auth.currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        mobile: formData.phone,
        address: formData.address,
        // You can update other fields here as well
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    }
  };

  // Do not render the form until the initial data is loaded
  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="personal-info-container">
      <h3>Personal Information</h3>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div> */}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            {/* Email is usually not editable */}
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email || ''}
              disabled 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* <div className="form-group">
          <label htmlFor="address">Address*</label>
          <input
            type="text"
            id="address"
            name="address"
            className="full-width"
            value={formData.address}
            onChange={handleChange}
          />
        </div> */}
        
        <div className="form-actions">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="update-btn">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;