import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this path is correct

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  useEffect(() => {
    // onAuthStateChanged is a listener from Firebase.
    // It runs whenever a user signs in or out.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Auth state check is complete
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  // The value provided to all children components
  const value = {
    currentUser,
  };

  // We don't render anything until the initial auth check is done
  // to avoid UI flicker (e.g., showing "Login" then quickly switching to "Profile")
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};