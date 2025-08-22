// src/component/select-location.jsx

import React, { useState, useCallback } from 'react';
import './select-location.css';
import { FiX, FiSearch, FiTarget, FiMapPin } from 'react-icons/fi';

// A custom hook for debouncing to prevent API calls on every keystroke
const useDebounce = (callback, delay) => {
  const [timer, setTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  }, [callback, delay, timer]);

  return debouncedCallback;
};


const SelectLocation = ({ isOpen, onClose, onLocationSet }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Function to fetch search results from API ---
  const fetchSearchResults = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the fetch function to run 500ms after the user stops typing
  const debouncedFetch = useDebounce(fetchSearchResults, 500);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetch(query);
  };
  
  // --- Function to handle when a user clicks a search result ---
  const handleResultClick = (result) => {
    // We use the full 'display_name' provided by the API
    onLocationSet(result.display_name);
    onClose(); // Close the modal
  };

  // --- Geolocation fetching (from previous step) remains the same ---
  const handleRequestLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.address;
          const displayAddress = `${address.road || ''}, ${address.suburb || address.city_district || ''}`;
          onLocationSet(displayAddress);
          onClose();
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Could not fetch address details.");
        }
      }, (error) => {
        alert("Geolocation permission denied or failed.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Location</h2>
          <button className="close-button" onClick={onClose}><FiX size={24} /></button>
        </div>

        {/* --- UPDATED SEARCH BAR --- */}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for area, street name..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* --- NEW: SEARCH RESULTS LIST --- */}
        <div className="search-results-container">
          {isLoading && <p className="loading-text">Searching...</p>}
          {!isLoading && searchResults.map((result) => (
            <div key={result.place_id} className="search-result-item" onClick={() => handleResultClick(result)}>
              <FiMapPin className="result-icon" />
              <div className="result-text">
                <h4>{result.address.road || result.address.suburb || result.name}</h4>
                <p>{result.display_name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- "USE CURRENT LOCATION" BUTTON (Unchanged) --- */}
        <div className="current-location-container" onClick={handleRequestLocation}>
          <div className="current-location-icon">
            <FiTarget size={24} color="#e94e77" />
          </div>
          <div className="current-location-text">
            <h3>Use My Current Location</h3>
            <p>Enable your current location for better services</p>
          </div>
          <button className="enable-button">Enable</button>
        </div>

      </div>
    </div>
  );
};

export default SelectLocation;