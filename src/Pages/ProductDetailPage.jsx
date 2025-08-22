import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css'; // This line imports the stylesheet

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { cartItems, addToCart, setCartItemQuantity } = useCart();
    const itemInCart = cartItems.find(item => item.id === productId);

    // Effect to fetch the product's data from Firestore
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const docRef = doc(db, 'PartyProducts', productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // Effect to sync the local quantity state with the quantity in the cart
    useEffect(() => {
        if (itemInCart) {
            setQuantity(itemInCart.quantityInCart);
        } else {
            setQuantity(1); // Default to 1 if not in cart
        }
    }, [itemInCart]);

    // Handler for the +/- quantity buttons
    const handleQuantityChange = (amount) => {
        const newQuantity = Math.max(1, quantity + amount);
        setQuantity(newQuantity);

        // If the item is already in the cart, update its quantity live
        if (itemInCart) {
            setCartItemQuantity(productId, newQuantity);
        }
    };

    // Handler for the main "ADD TO CART" or "UPDATE CART" button
    const handleAddToCartClick = () => {
        if (product) {
            // Only add to cart if it's not already there
            if (!itemInCart) {
                addToCart(product, quantity);
            }
            alert('Cart updated!');
        }
    };

    if (loading) return <div className="loading-container">Loading Product...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!product) return null;

    // The JSX to render the page
    return (
        <div className="product-detail-container">
            <div className="product-detail-layout">
                <div className="image-gallery">
                    <div className="main-image-wrapper">
                        {/* --- THE FIX IS HERE: The className="main-image" was added --- */}
                        <img src={product.imageUrl} alt={product.name} className="main-image" />
                    </div>
                </div>
                <div className="product-info-details">
                    <span className="product-category-tag">{product.category}</span>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="price-section">
                        <span className="current-price">₹{product.price}</span>
                    </div>
                    <p className="product-description">{product.description || 'No description available.'}</p>
                    <div className="actions">
                        <div className="quantity-selector">
                            <button onClick={() => handleQuantityChange(-1)}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
                            {itemInCart ? 'UPDATE CART' : 'ADD TO CART'}
                        </button>
                    </div>
                    <div className="meta-info">
                        <p><strong>SKU:</strong> {product.id.slice(0, 10).toUpperCase()}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;