import React from 'react';
import ProductCard from './ProductCard'; 
import './ProductGrid.css';

// The component now receives products as a prop.
// No more useState or useEffect for fetching data here.
const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-container">
        <p>No products found for this category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {/* The title is removed as it's now handled by the parent ShopPage */}
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;