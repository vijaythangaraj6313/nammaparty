import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // <-- Import Link
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const itemInCart = cartItems.find(item => item.id === product.id);

  // Stop the Link from activating when a button inside it is clicked
  const handleButtonClick = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
  };

  const handleAddToCart = (e) => {
    handleButtonClick(e);
    addToCart(product);
  };
  
  const handleRemoveFromCart = (e) => {
    handleButtonClick(e);
    removeFromCart(product.id);
  };

  return (
    // The entire card is now a link to the product's detail page
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          {product.quantity && <p className="product-quantity">{`${product.quantity} ${product.unit || ''}`.trim()}</p>}
          <div className="product-footer">
            <p className="product-price">₹{product.price || 'N/A'}</p>
            
            {itemInCart ? (
              <div className="quantity-control" onClick={handleButtonClick}>
                <button onClick={handleRemoveFromCart}>−</button>
                <span>{itemInCart.quantityInCart}</span>
                <button onClick={handleAddToCart}>+</button>
              </div>
            ) : (
              <button className="add-button" onClick={handleAddToCart}>
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;