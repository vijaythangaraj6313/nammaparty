import React, { useState } from 'react';

const AddressForm = ({ savedLocation, onSave, onChangeLocation }) => {
    const [house, setHouse] = useState('');
    const [building, setBuilding] = useState('');
    const [landmark, setLandmark] = useState('');
    const [label, setLabel] = useState('Home');
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!house || !building || !receiverName || !receiverPhone) {
            alert("Please fill all required fields.");
            return;
        }
        onSave({ house, building, landmark, label, receiverName, receiverPhone });
    };

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <h3 className="address-form-title">Add Address Details</h3>
            <div className="saved-location-display">
                <p><strong>{savedLocation.addressString.split(',')[0]}</strong></p>
                <p>{savedLocation.addressString}</p>
                <button type="button" onClick={onChangeLocation} className="change-location-btn">Change</button>
            </div>
            
            <input type="text" value={house} onChange={e => setHouse(e.target.value)} placeholder="House No. & Floor*" required />
            <input type="text" value={building} onChange={e => setBuilding(e.target.value)} placeholder="Building & Block No.*" required />
            <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Landmark & Area Name (Optional)" />

            <div className="address-label-group">
                <p>Add Address Label</p>
                <button type="button" className={label === 'Home' ? 'active' : ''} onClick={() => setLabel('Home')}>Home</button>
                <button type="button" className={label === 'Work' ? 'active' : ''} onClick={() => setLabel('Work')}>Work</button>
                <button type="button" className={label === 'Other' ? 'active' : ''} onClick={() => setLabel('Other')}>Other</button>
            </div>
            
            <h4 className="receiver-details-title">Receiver Details</h4>
             <input type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="Receiver Name*" required />
             <input type="tel" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} placeholder="Receiver Phone Number*" required />

            <button type="submit" className="save-address-btn">Save & Continue</button>
        </form>
    );
};

export default AddressForm;