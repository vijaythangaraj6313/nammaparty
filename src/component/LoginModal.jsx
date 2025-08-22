// src/component/LoginModal.jsx

import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.css'; // Ensure this CSS file is imported
import { FiX } from 'react-icons/fi';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // This ref is essential for detecting clicks outside the modal
  const modalRef = useRef(null);

  const handleContinue = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
      onClose();
    } catch (error) {
      console.error("Login error:", error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  // This hook handles the "click outside" functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref is attached and the click is outside, call onClose
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      {/* 
        FIX #1: The ref MUST be attached to the content box 
        to define the "inside" area.
      */}
      <div className="login-modal-content" ref={modalRef}>
        
        {/* 
          FIX #2: The close button MUST have the onClick handler 
          to call the onClose function.
        */}
        <button className="login-close-button" onClick={onClose}>
          <FiX size={24} color="white" />
        </button>
        
        <h1 className="login-logo">Namma Meals</h1>
        <h2 className="login-title">Meals delivered with care</h2>
        
        <div className="input-container">
            <input 
              type="email" 
              placeholder="Enter Email" 
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="input-container">
            <input 
              type="password" 
              placeholder="Enter Password" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button className="continue-button" onClick={handleContinue}>Continue</button>

        <p className="register-text">
          Don't have an account?{' '}
          <button className="register-link-button" onClick={onSwitchToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;