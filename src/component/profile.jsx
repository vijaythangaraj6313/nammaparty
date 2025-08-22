// src/component/Profile.jsx

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Make sure this CSS file is created and imported

// 1. Import the 'auth' instance from your firebase configuration
import { auth } from '../firebase';

const Profile = ({ handleLogout, onClose }) => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // 2. Get the current user from the auth instance
  const user = auth.currentUser;

  const onLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  // Your "click outside" useEffect hook is perfect and needs no changes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={profileRef}>
      {/* 3. Display the user's email if they exist */}
      {user && (
        <div className="profile-info">
          <p className="profile-greeting">Signed in as</p>
          <p className="profile-email">{user.email}</p>
        </div>
      )}
      
      {/* A divider for better visual separation */}
      <hr className="profile-divider" />
      
      <button
        onClick={onLogoutClick}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;