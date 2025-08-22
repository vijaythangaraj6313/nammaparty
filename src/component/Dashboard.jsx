// src/component/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiUser, FiLogOut, FiLock } from 'react-icons/fi';
import './Dashboard.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Import the child components for different views
import PersonalInfo from './PersonalInfo';
import ChangePassword from './ChangePassword';

const Dashboard = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This state controls which component is shown in the main content area
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Fetch the user's profile data from Firestore when the component loads
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'customers', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user profile found in Firestore!");
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);

  const onLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  // This function decides which component to render based on the activeView state
  const renderContent = () => {
    switch (activeView) {
      case 'personalInfo':
        return <PersonalInfo userData={userData} />;
      case 'changePassword':
        return <ChangePassword />; // This will render your password form
      default:
        // This is the default main dashboard view
        return (
          <>
            <div className="profile-header">
              <h3>Hello, {userData?.name || user.email}</h3>
              <h2>Welcome to your Profile</h2>
            </div>
            <div className="stats-cards">{/*...stats cards...*/}</div>
            <div className="info-sections">{/*...info sections...*/}</div>
          </>
        );
    }
  };

  return (
    <>
      <div className="dashboard-banner">{/*...banner...*/}</div>
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {/* Sidebar buttons update the activeView state */}
            <button onClick={() => setActiveView('dashboard')} className={`sidebar-link ${activeView === 'dashboard' ? 'active' : ''}`}>
              <FiGrid className="sidebar-icon" /> Dashboard
            </button>
            <button onClick={() => setActiveView('personalInfo')} className={`sidebar-link ${activeView === 'personalInfo' ? 'active' : ''}`}>
              <FiUser className="sidebar-icon" /> Personal Info
            </button>
            <button onClick={() => setActiveView('changePassword')} className={`sidebar-link ${activeView === 'changePassword' ? 'active' : ''}`}>
              <FiLock className="sidebar-icon" /> Change Password
            </button>
            <button onClick={onLogoutClick} className="sidebar-link logout-btn">
              <FiLogOut className="sidebar-icon" /> Logout
            </button>
          </nav>
        </aside>
        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default Dashboard;