// src/component/OrderSummary.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './OrderSummary.css';

const OrderSummary = () => {
    const { cartItems, clearCart } = useCart();
    const { currentUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // The address is passed from the previous step via navigation state
    const { address } = location.state || {};

    if (!address) {
        return <div className="order-summary-container"><p>Address not provided. Please go back.</p></div>;
    }
    
    // --- Bill Calculations ---
    const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
    const originalItemTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantityInCart, 0);
    
    const handlingCharge = 18.99;
    const originalDeliveryFee = 30.00;
    const deliveryFee = 0; // As per the image, delivery is free
    const gst = 2.28;

    const totalBill = itemTotal + handlingCharge + deliveryFee + gst;
    const totalSaved = (originalItemTotal - itemTotal) + (originalDeliveryFee - deliveryFee);

    // Function to generate a random order ID like in the image
    const generateOrderId = () => {
        const prefix = "SPGGHSBCN";
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `#${prefix}${randomNumber}`;
    };

    const handleConfirmOrder = async () => {
        if (!currentUser || cartItems.length === 0) {
            alert("Cannot place order. User not logged in or cart is empty.");
            return;
        }

        const orderDetails = {
            orderId: generateOrderId(),
            userId: currentUser.uid,
            items: cartItems,
            billing: {
                itemTotal: itemTotal.toFixed(2),
                handlingCharge: handlingCharge.toFixed(2),
                deliveryFee: deliveryFee.toFixed(2),
                gst: gst.toFixed(2),
                totalBill: totalBill.toFixed(2),
                totalSaved: totalSaved.toFixed(2),
            },
            deliveryAddress: address,
            orderPlacedAt: serverTimestamp(),
            status: "Awaiting Payment", // --- CHANGE: Update initial status
        };

          try {
            const docRef = await addDoc(collection(db, 'orders'), orderDetails);
            console.log("Order details saved with ID: ", docRef.id);
            
            // --- CHANGE: Navigate to the payment page instead of clearing cart ---
            navigate('/payment', { 
                state: { 
                    totalBill: totalBill, 
                    orderId: orderDetails.orderId 
                } 
            });

        } catch (error) {
            console.error("Error saving order: ", error);
            alert("Failed to proceed to payment. Please try again.");
        }
    };

    return (
        <div className="order-summary-container">
            <h2 className="summary-title">Order Summary</h2>

            <div className="order-section items-section">
                <h3>{cartItems.length} items in order</h3>
                {cartItems.map(item => (
                    <div key={item.id} className="summary-item">
                        <img src={item.imageUrl} alt={item.name} className="item-image"/>
                        <div className="item-info">
                            <p className="item-name">{item.name}</p>
                            <p className="item-unit-info">{item.weight || '200 g'} ・ {item.quantityInCart} unit</p>
                        </div>
                        <div className="item-pricing">
                           <span className="current-price">₹{item.price}</span>
                           {item.originalPrice && <span className="original-price">₹{item.originalPrice}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-section bill-summary">
                <h3>Bill Summary</h3>
                <div className="bill-row">
                    <span>Item Total</span>
                    <span><span className="original-price">₹{originalItemTotal.toFixed(2)}</span> ₹{itemTotal.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                    <span>Handling Charge</span>
                    <span>₹{handlingCharge.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                    <span>Delivery Fee</span>
                    <span><span className="original-price">₹{originalDeliveryFee.toFixed(2)}</span> ₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                    <span>GST</span>
                    <span>₹{gst.toFixed(2)}</span>
                </div>
                <hr />
                <div className="bill-row total-bill">
                    <span>Total Bill</span>
                    <span>₹{totalBill.toFixed(2)}</span>
                </div>
                <div className="saved-amount">
                    SAVED ₹{totalSaved.toFixed(2)}
                </div>
            </div>

            <div className="order-section order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> {generateOrderId()}</p>
                <p><strong>Delivery Address:</strong> {`${address.house}, ${address.building}, ${address.addressString}`}</p>
                <p><strong>Order Placed at:</strong> {new Date().toLocaleString()}</p>
            </div>

            <button className="confirm-order-btn" onClick={handleConfirmOrder}>
                Confirm Order
            </button>
        </div>
    );
};

export default OrderSummary;