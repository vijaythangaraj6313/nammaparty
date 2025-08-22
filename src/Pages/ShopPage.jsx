import React, { useState, useEffect } from 'react';
// --- CHANGE 1: Import the useLocation hook ---
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CategoryFilter from '../component/CategoryFilter';
import FilteredProductGrid from '../component/FilteredProductGrid';
import './ShopPage.css';

const ShopPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All'); // Default to 'All'
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    
    // --- CHANGE 2: Initialize the location object ---
    const location = useLocation();

    // This effect fetches data and runs only once
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productsPromise = getDocs(collection(db, 'PartyProducts'));
                const categoriesPromise = getDocs(collection(db, 'Category Party'));

                const [productsSnapshot, categoriesSnapshot] = await Promise.all([
                    productsPromise,
                    categoriesPromise,
                ]);

                if (productsSnapshot.empty) {
                    setFetchError('No products were found in the database.');
                }

                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setAllProducts(productsData);
                setCategories(categoriesData);

            } catch (error) {
                setFetchError(`Error: ${error.message}.`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- CHANGE 3: Add a new effect to check for pre-selected category ---
    useEffect(() => {
        // Check if state was passed during navigation and if it has a 'category' property
        const preselectedCategory = location.state?.category;
        if (preselectedCategory) {
            setSelectedCategory(preselectedCategory);
        }
    }, [location.state]); // This effect will re-run if the navigation state changes

    // Filtering logic (no changes needed here)
    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter(product => {
            if (!product.category) return false;
            return product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
        });
    
    const gridTitle = selectedCategory === 'All' ? 'All Products' : selectedCategory;

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="shop-page">
            <aside className="sidebar">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                />
            </aside>
            <main className="product-display-area">
                <div className="shop-header">
                    <p>Showing {filteredProducts.length} of {allProducts.length} results</p>
                    <select className="sort-dropdown">
                        <option value="default">Sort by: Default</option>
                    </select>
                </div>
                
                {fetchError && !allProducts.length && <div className="error-message">{fetchError}</div>}
                
                <FilteredProductGrid 
                    products={filteredProducts} 
                    title={gridTitle}
                />
            </main>
        </div>
    );
};

export default ShopPage;