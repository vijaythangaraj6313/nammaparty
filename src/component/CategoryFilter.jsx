import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  const handleCategoryChange = (categoryName) => {
    if (selectedCategory === categoryName) {
      onCategorySelect('All');
    } else {
      onCategorySelect(categoryName);
    }
  };

  return (
    <div className="category-filter">
      <h3 className="filter-title">Product Categories</h3>
      <ul className="category-list">
        <li className="category-list-item">
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'All'}
              onChange={() => onCategorySelect('All')}
            />
            All
          </label>
        </li>
        {categories.map(cat => (
          <li key={cat.id} className="category-list-item">
            <label>
              <input
                type="checkbox"
                checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                onChange={() => handleCategoryChange(cat.name)}
              />
              {cat.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;