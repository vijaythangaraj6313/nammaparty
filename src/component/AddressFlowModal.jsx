import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import LocationPicker from './LocationPicker';
import AddressForm from './AddressForm';
import './AddressFlowModal.css';

const AddressFlowModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth(); // Get the current logged-in user
    const [step, setStep] = useState('map'); // 'map' or 'details'
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleLocationConfirm = (location) => {
        setSelectedLocation(location);
        setStep('details');
    };

    const handleSaveAddress = async (addressDetails) => {
        if (!currentUser) {
            alert("Please log in to save an address.");
            return;
        }

        if (!selectedLocation) {
            alert("Something went wrong. Please select a location again.");
            return;
        }

        const fullAddress = {
            userId: currentUser.uid,
            ...selectedLocation, // { lat, lng, addressString }
            ...addressDetails, // { house, building, landmark, label, receiverName, receiverPhone }
            createdAt: new Date(),
        };

        try {
            // Store the address in a subcollection 'addresses' under the user's document
            const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), fullAddress);
            console.log("Address saved with ID: ", docRef.id);
            alert("Address saved successfully!");
            onClose(); // Close the modal on success
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
                {step === 'map' && (
                    <LocationPicker onConfirm={handleLocationConfirm} />
                )}
                {step === 'details' && (
                    <AddressForm 
                        savedLocation={selectedLocation} 
                        onSave={handleSaveAddress}
                        onChangeLocation={() => setStep('map')} // Allow user to go back
                    />
                )}
            </div>
        </div>
    );
};

export default AddressFlowModal;