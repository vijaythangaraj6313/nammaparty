import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, limit } from 'firebase/firestore';
import './PaymentPage.css';

// --- A styled dialog component for success/error messages ---
const InfoDialog = ({ message, type, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className="dialog-backdrop">
            {/* Add a class for success/error styling */}
            <div className={`dialog-content ${isSuccess ? 'success-dialog' : ''}`}>
                <h3 className={isSuccess ? 'dialog-success' : 'dialog-error'}>
                    {isSuccess ? 'Success' : 'Error'}
                </h3>
                <p>{message}</p>
                <button onClick={onClose} className="dialog-ok-btn">OK</button>
            </div>
        </div>
    );
};


// --- Sub-component for UPI Payment ---
const UpiPayment = ({ onPlaceOrder }) => (
    <div className="payment-method-details">
        <h4>Pay by any UPI app</h4>
        <p className="upi-scan-text">Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc.</p>
        <div className="upi-content">
            <div className="qr-code-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=example@upi" alt="QR Code" />
                <button className="generate-qr-btn">Generate QR Code</button>
            </div>
            <div className="or-divider">OR</div>
            <div className="vpa-container">
                <label htmlFor="upi-id">UPI ID / VPA</label>
                <input type="text" id="upi-id" placeholder="e.g rakesh@upi" />
                <button className="verify-pay-btn" onClick={() => onPlaceOrder('UPI')}>Verify and Pay</button>
            </div>
        </div>
    </div>
);

// --- Sub-component for Card Payment ---
const CardPayment = ({ onPlaceOrder }) => (
    <div className="payment-method-details">
        <h4>Enter Credit / Debit card details</h4>
        <div className="card-form">
            <label htmlFor="card-number">Card Number</label>
            <input type="text" id="card-number" placeholder="Enter Card Number" />
            <div className="card-details-row">
                <div className="expiry-group">
                    <label htmlFor="expiry">Expiry</label>
                    <input type="text" id="expiry" placeholder="MM/YY" />
                </div>
                <div className="cvv-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="CVV" />
                </div>
            </div>
            <button className="proceed-to-pay-btn" onClick={() => onPlaceOrder('Card')}>Proceed to Pay</button>
        </div>
    </div>
);

// --- Sub-component for Pay on Delivery ---
const CodPayment = ({ onPlaceOrder }) => (
    <div className="payment-method-details">
        <h4>Pay on Delivery (Cash/UPI)</h4>
        <p>You can pay using cash or UPI at the time of delivery. Please keep the exact amount handy.</p>
        <button className="proceed-to-pay-btn" onClick={() => onPlaceOrder('COD')}>
            Place Order
        </button>
    </div>
);


// --- Main Payment Page Component ---
const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    
    const { totalBill, orderId } = location.state || {};
    
    const [activeMethod, setActiveMethod] = useState('UPI');
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState({ message: '', type: '' });

    // Redirect to home if essential data is missing
    if (!totalBill || !orderId) {
        React.useEffect(() => navigate('/'), [navigate]);
        return null;
    }

    // Handles closing the dialog and navigating on success
    const handleDialogClose = () => {
        if (dialog.type === 'success') {
            navigate('/');
        }
        setDialog({ message: '', type: '' });
    };
    
    // Finds the order in Firestore, updates it, and shows a success/error message
    const handleFinalizeOrder = async (paymentMethod) => {
        setIsLoading(true);
        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where("orderId", "==", orderId), limit(1));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("Could not find your order. It might not have been created correctly.");
            }

            const orderDoc = querySnapshot.docs[0];

            await updateDoc(orderDoc.ref, {
                status: "Placed",
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === 'COD' ? 'Pending at Delivery' : 'Paid',
            });

            clearCart();
            setDialog({ message: 'Your order has been placed successfully!', type: 'success' });

        } catch (error) {
            console.error("Error finalizing order: ", error);
            setDialog({ message: 'There was an error placing your order. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const paymentMethods = [
        { id: 'UPI', name: 'UPI' },
        { id: 'Card', name: 'Credit / Debit Card' },
        { id: 'COD', name: 'Pay On Delivery' },
        // { id: 'Pluxee', name: 'Pluxee' },
        // { id: 'Paylater', name: 'Paylater' },
        // { id: 'Wallets', name: 'Wallets' },
        // { id: 'Netbanking', name: 'Netbanking' },
    ];

    return (
        <>
            <InfoDialog 
                message={dialog.message} 
                type={dialog.type} 
                onClose={handleDialogClose} 
            />
            
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-text">Placing your order...</div>
                </div>
            )}
            
            <div className="payment-page-container">
                <header className="payment-header">
                    <h2>Order Summary</h2>
                    <div className="amount-display">
                        <span>Amount</span>
                        <span className="amount-value">₹{totalBill.toFixed(2)}</span>
                    </div>
                </header>
                <main className="payment-body">
                    <aside className="payment-methods-sidebar">
                       <h3>Payment Methods</h3>
                            <ul>
                                {paymentMethods.map(method => (
                                    <li
                                        key={method.id}
                                        className={activeMethod === method.id ? 'active' : ''}
                                        onClick={() => setActiveMethod(method.id)}
                                    >
                                        {method.name}
                                    </li>
                                ))}
                            </ul>
                        {/* <div className="secured-by">secured by <strong>JUSPAY</strong></div> */}
                    </aside>
                    <section className="payment-content">
                        {activeMethod === 'UPI' && <UpiPayment onPlaceOrder={handleFinalizeOrder} />}
                        {activeMethod === 'Card' && <CardPayment onPlaceOrder={handleFinalizeOrder} />}
                        {activeMethod === 'COD' && <CodPayment onPlaceOrder={handleFinalizeOrder} />}
                        
                        {['Pluxee', 'Paylater', 'Wallets', 'Netbanking'].includes(activeMethod) && (
                            <div className="payment-method-details">
                                <h4>{activeMethod}</h4>
                                <p>This payment method is not yet implemented.</p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
};

export default PaymentPage;