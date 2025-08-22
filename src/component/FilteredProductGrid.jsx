import React from 'react';
import ProductCard from './ProductCard'; 
import './ProductGrid.css'; // You can reuse the CSS from your other grid

const FilteredProductGrid = ({ products, title }) => {
  // Show a message if the filtered list is empty
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-container">
        <h2 className="grid-title">{title}</h2>
        <p className="no-products-found">No products found for this category.</p>
      </div>
    );
  }

  // Display the grid of products that were passed in
  return (
    <div className="product-grid-container">
      <h2 className="grid-title">{title}</h2>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FilteredProductGrid;