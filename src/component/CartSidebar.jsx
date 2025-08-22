import React from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

// The props are already correctly defined from your code
const CartSidebar = ({ isOpen, onClose, onAddAddressClick }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <p className="item-name">{item.name}</p>
                  
                  {/* --- CHANGE 1: Correctly displays the quantity in the cart --- */}
                  <p className="item-quantity-desc">{`${item.quantityInCart} x ${item.unit || ''}`}</p>

                  <p className="item-price">₹{item.price}</p>
                </div>
                <div className="quantity-control cart-quantity">
                  <button onClick={() => removeFromCart(item.id)}>−</button>
                  <span>{item.quantityInCart}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
            <h4>Subtotal: ₹{total.toFixed(2)}</h4>
            
            {/* --- CHANGE 2: Added the onClick handler to the button --- */}
            <button className="proceed-btn" onClick={onAddAddressClick}>
                Add Address to proceed
            </button>

        </div>
      </div>
    </>
  );
};

export default CartSidebar;