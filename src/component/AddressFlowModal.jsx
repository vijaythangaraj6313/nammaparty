// src/component/AddressFlowModal.js (Updated Version)

import React, { useState } from 'react';
// --- CHANGE 1: Import useNavigate ---
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import LocationPicker from './LocationPicker';
import AddressForm from './AddressForm';
import './AddressFlowModal.css';

const AddressFlowModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [step, setStep] = useState('map');
    const [selectedLocation, setSelectedLocation] = useState(null);
    // --- CHANGE 2: Initialize navigate ---
    const navigate = useNavigate();

    const handleLocationConfirm = (location) => {
        setSelectedLocation(location);
        setStep('details');
    };

    const handleSaveAddress = async (addressDetails) => {
        if (!currentUser || !selectedLocation) {
            alert("Please log in and select a location.");
            return;
        }

        const fullAddress = {
            userId: currentUser.uid,
            ...selectedLocation,
            ...addressDetails,
            createdAt: new Date(),
        };

        try {
            await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), fullAddress);
            console.log("Address saved successfully!");
            
            onClose(); // Close the modal

            // --- CHANGE 3: Navigate to Order Summary with the address state ---
            navigate('/order-summary', { state: { address: fullAddress } });

        } catch (error) {
            console.error("Error saving address: ", error);
            alert("Failed to save address. Please try again.");
        }
    };
    
    const handleClose = () => {
        setStep('map');
        setSelectedLocation(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleClose}>×</button>
                {step === 'map' && <LocationPicker onConfirm={handleLocationConfirm} />}
                {step === 'details' && (
                    <AddressForm 
                        savedLocation={selectedLocation} 
                        onSave={handleSaveAddress}
                        onChangeLocation={() => setStep('map')}
                    />
                )}
            </div>
        </div>
    );
};

export default AddressFlowModal;