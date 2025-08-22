import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './OrderSummary.css'; // This import needs the CSS file to be correct

// --- Helper Icon Component ---
const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);


const OrderSummary = () => {
    const { cartItems, clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    // --- Get the full address object from the navigation state ---
    const fullAddress = location.state?.fullAddress;
    
    const [orderDetails] = useState({
        id: `UHM${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        placedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    });
    
    const [copySuccess, setCopySuccess] = useState('');

    // --- Error handling: Redirect if cart or address is missing ---
    if (!fullAddress || cartItems.length === 0) {
        return (
            <div className="order-summary-container error-page">
                <h2>Could not display summary</h2>
                <p>Please start the checkout process from your cart.</p>
                <button className="action-btn" onClick={() => navigate('/')}>Back to Shop</button>
            </div>
        );
    }

    // --- Dynamic Bill Calculation ---
    const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
    const handlingCharge = 18.99;
    const deliveryFee = itemTotal > 500 ? 0 : 30; // Example: Free delivery over 500
    const gst = (itemTotal + handlingCharge) * 0.05; // Example: 5% GST
    const totalBill = itemTotal + handlingCharge + deliveryFee + gst;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed');
        });
    };
    
    const handlePlaceOrder = () => {
        alert("This is a simulation. Order placed successfully!");
        clearCart();
        navigate('/');
    };

    return (
        <div className="order-summary-container">
            <div className="summary-header">
                <h2>Order Confirmed!</h2>
            </div>

            <div className="summary-card">
                 <h3>Order Details</h3>
                 <div className="order-details-grid">
                    <p className="detail-label">Order ID</p>
                    <div className="detail-value with-copy">
                        <span>{orderDetails.id}</span>
                        <button onClick={() => copyToClipboard(orderDetails.id)} className="copy-btn"><CopyIcon /></button>
                         {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
                    </div>
                    <p className="detail-label">Order Placed at</p>
                    <p className="detail-value">{orderDetails.placedAt}</p>
                 </div>
            </div>

            <div className="summary-card">
                <h3>Delivery Address</h3>
                <div className="address-details-summary">
                    <strong>{fullAddress.receiverName}</strong>
                    <p>{`${fullAddress.house}, ${fullAddress.building}`}</p>
                    <p>{fullAddress.addressString}</p>
                    <p>Phone: {fullAddress.receiverPhone}</p>
                </div>
            </div>

            <div className="summary-card">
                <h3>Items in Order ({cartItems.length})</h3>
                {cartItems.map(item => (
                    <div className="summary-item" key={item.id}>
                        <span className="item-info">{item.name} (x{item.quantityInCart})</span>
                        <span className="item-price">₹{(item.price * item.quantityInCart).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="summary-card">
                <h3>Bill Details</h3>
                <div className="bill-row"><span>Item Total</span><span>₹{itemTotal.toFixed(2)}</span></div>
                <div className="bill-row"><span>Handling Charge</span><span>₹{handlingCharge.toFixed(2)}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span></div>
                <div className="bill-row gst-row"><span>GST</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="bill-row total-bill"><span>Total Paid</span><span>₹{totalBill.toFixed(2)}</span></div>
            </div>

            <button className="action-btn" onClick={handlePlaceOrder}>
                Go to Homepage
            </button>
        </div>
    );
};

export default OrderSummary;