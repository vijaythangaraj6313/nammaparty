import React, { useState } from 'react';
import { db } from '../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';
import './AddressFlowModal.css';

// --- Placeholder Components & Mocks (replace with your actual components) ---
const useAuth = () => ({ currentUser: { uid: 'mock_user_123' } });

const LocationPicker = ({ onConfirm }) => (
    <div>
        <h3>Select Delivery Location (Placeholder)</h3>
        <div className="mock-map">Mock Map Area</div>
        <button
            className="save-address-btn"
            onClick={() => onConfirm({
                lat: 12.9716,
                lng: 77.5946,
                addressString: '123 MG Road, Bengaluru, Karnataka, India'
            })}
        >
            Confirm Location
        </button>
    </div>
);

const AddressForm = ({ savedLocation, onSave, onChangeLocation }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ house: 'A-101', building: 'Sunshine Apartments', landmark: 'Near Park', label: 'Home', receiverName: 'Test User', receiverPhone: '9876543210' });
    };
    return (
        <form onSubmit={handleSubmit}>
            <h3>Enter Address Details (Placeholder Form)</h3>
            <div className="saved-location-display">{savedLocation.addressString} <button type="button" onClick={onChangeLocation}>Change</button></div>
            <p>This is a placeholder form. Clicking "Save" will use pre-filled data.</p>
            <button type="submit" className="save-address-btn">Save & Continue</button>
        </form>
    );
};
// --- End Placeholders ---


const AddressFlowModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const { currentUser } = useAuth();
    const [step, setStep] = useState('map');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleLocationConfirm = (location) => {
        setSelectedLocation(location);
        setStep('details');
    };

    const handleSaveAddress = async (addressDetails) => {
        if (!currentUser || !selectedLocation) return;
        const fullAddress = {
            userId: currentUser.uid,
            ...selectedLocation,
            ...addressDetails,
            createdAt: new Date(),
        };

        try {
            // This would save to your actual Firestore. We are mocking it here.
            // await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), fullAddress);
            console.log("Simulating save to Firestore:", fullAddress);
            alert("Address saved successfully!");
            if (onSaveSuccess) {
                onSaveSuccess(fullAddress);
            }
            onClose();
        } catch (error) {
            console.error("Error saving address: ", error);
            alert("Failed to save address.");
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