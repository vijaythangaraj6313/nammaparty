// src/component/ChangePassword.jsx

import React, { useState } from 'react';
import { auth, db } from '../firebase'; // 1. Import 'db' from firebase
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore'; // 2. Import firestore functions
import './ChangePassword.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Basic Validation ---
    if (!currentPassword || !newPassword || !reenterPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== reenterPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('No user is signed in.');
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      // 1. Re-authenticate the user in Firebase Auth
      await reauthenticateWithCredential(user, credential);

      // 2. If successful, update the password in Firebase Auth
      await updatePassword(user, newPassword);

      // --- 3. NEW CODE: Update the password in Firestore ---
      // Get a reference to the user's document in the 'customers' collection
      const userDocRef = doc(db, 'customers', user.uid);
      
      // Update the 'password' field with the new password
      await updateDoc(userDocRef, {
        password: newPassword
      });
      // --- END OF NEW CODE ---

      setSuccess('Password updated successfully!');
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setReenterPassword('');

    } catch (error) {
      console.error("Password update error:", error);
      if (error.code === 'auth/wrong-password') {
        setError('The current password you entered is incorrect.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="change-password-container">
      <h3>Change Password</h3>
      <form onSubmit={handleUpdatePassword}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password*</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Password*</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reenterPassword">Re-enter Password*</label>
          <input
            type="password"
            id="reenterPassword"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-actions">
          <button type="submit" className="update-btn">Update Password</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;