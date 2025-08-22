// src/component/RegisterModal.jsx

import React, { useState, useRef, useEffect } from 'react';
import './LoginModal.css'; // We can reuse the same CSS file for a consistent look
import { FiX } from 'react-icons/fi';

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // Ref for the "click outside" logic
  const modalRef = useRef(null);

  const handleRegister = async () => {
    if (!name || !email || !mobile || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // This part only runs if the above line is successful
      await setDoc(doc(db, "customers", user.uid), {
        name: name,
        email: email,
        mobile: mobile,
        password: password, // Note: Storing plain text passwords in Firestore is not recommended
        createdAt: serverTimestamp(),
        app_type: 'Party'
      });

      alert("Registration successful! Please log in.");
      onSwitchToLogin();

    } catch (error) {
      // --- IMPROVED ERROR HANDLING ---
      // Check for the specific "email already in use" error
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please log in instead.");
        onSwitchToLogin(); // Optionally switch them to the login modal
      } else {
        // Handle other potential errors (weak password, invalid email, etc.)
        console.error("Registration error:", error.message);
        alert(`Registration failed: ${error.message}`);
      }
    }
  };
  
  // Hook for "click outside" functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
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
      <div className="login-modal-content" ref={modalRef}>
        
        <button className="login-close-button" onClick={onClose}>
            <FiX size={24} color="white" />
        </button>
        
        <h1 className="login-logo">Register</h1>
        <h2 className="login-title">Create your account</h2>

        <div className="input-container">
            <input 
              type="text" 
              placeholder="Name" 
              className="login-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
        </div>
        <div className="input-container">
            <input 
              type="email" 
              placeholder="Email" 
              className="login-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <div className="input-container">
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              className="login-input" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
            />
        </div>
        <div className="input-container">
            <input 
              type="password" 
              placeholder="Password" 
              className="login-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
        </div>

        <button className="continue-button" onClick={handleRegister}>Continue</button>
      </div>
    </div>
  );
};

export default RegisterModal;