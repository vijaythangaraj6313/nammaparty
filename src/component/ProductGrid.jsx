// src/component/ProductGrid.jsx

import React, { useState, useEffect } from 'react';
// Import 'query' and 'limit' to restrict the number of documents fetched
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from './ProductCard'; 
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. Reference the correct 'partyProducts' collection
        const productsRef = collection(db, 'PartyProducts');

        // 2. Create a query to get only the first 10 documents
        const q = query(productsRef, limit(10));

        // 3. Execute the query
        const querySnapshot = await getDocs(q);

        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
        <div className="product-grid-container">
             <h2 className="grid-title">Loading Products...</h2>
        </div>
    );
  }

  return (
    <div className="product-grid-container">
      <h2 className="grid-title">All Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;