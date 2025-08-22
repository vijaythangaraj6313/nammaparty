import React from 'react';
import './Header.css';
import { FiMapPin, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ onLocationClick, onLoginClick, address, isLoggedIn, onCartClick, onProfileClick }) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantityInCart, 0);

  return (
    <header className="header">
      {/* --- Left Side: Logo --- */}
      <div className="header-left">
        <Link to="/" className="logo-link">
          <h1 className="logo">Namma Party</h1>
        </Link>
      </div>

      {/* --- Center: Navigation Links --- */}
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        {/* <Link to="/dashboard" className="nav-link">User Dashboard</Link> */}
        <Link to="/contact" className="nav-link">Contact Us</Link>
                <Link to="/shop" className="nav-link">Shop</Link>

      </nav>

      {/* --- Right Side: Actions --- */}
      <div className="header-right">
        <button onClick={onLocationClick} className="nav-button location-button">
          <FiMapPin size={16} />
          <span>{address || 'Select Location'}</span>
        </button>

        {isLoggedIn ? (
          <button onClick={onProfileClick} className="nav-button">
            Profile
          </button>
        ) : (
          <button onClick={onLoginClick} className="nav-button">
            Login
          </button>
        )}

        <button onClick={onCartClick} className="nav-button cart-button">
          <FiShoppingCart size={20} />
          {itemCount > 0 && <div className="cart-count">{itemCount}</div>}
        </button>
      </div>
    </header>
  );
};

export default Header;