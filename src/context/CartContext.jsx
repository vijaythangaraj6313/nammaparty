import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // This function remains the same, used for adding items
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantityInCart: item.quantityInCart + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantityInCart: quantity }];
      }
    });
  };

  // This function remains the same, used for removing one item at a time
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem?.quantityInCart === 1) {
        return prevItems.filter(item => item.id !== productId);
      } else {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantityInCart: item.quantityInCart - 1 } : item
        );
      }
    });
  };

  // --- NEW FUNCTION ---
  // This function directly sets the quantity of an item in the cart.
  // This is perfect for the Product Detail Page.
  const setCartItemQuantity = (productId, newQuantity) => {
    const quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1

    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantityInCart: quantity }
          : item
      );
    });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    setCartItemQuantity, // <-- Export the new function
  };

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;};