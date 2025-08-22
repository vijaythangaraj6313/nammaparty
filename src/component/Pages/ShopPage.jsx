import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CategoryFilter from '../component/CategoryFilter';
import ProductGrid from '../component/ProductGrid';
import './ShopPage.css';

const ShopPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsPromise = getDocs(collection(db, 'partyProducts'));
                const categoriesPromise = getDocs(collection(db, 'Category Party'));
                const [productsSnapshot, categoriesSnapshot] = await Promise.all([productsPromise, categoriesPromise]);

                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setAllProducts(productsData);
                setCategories(categoriesData);
                
                // IMPORTANT FOR DEBUGGING: Check your console to see the exact data
                console.log("Categories from Firestore:", categoriesData.map(c => c.name));
                console.log("Products from Firestore:", productsData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- MORE ROBUST FILTERING LOGIC ---
    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter(product => {
            // Check if the product even has a category field
            if (!product.category) {
                return false; 
            }
            // Compare by trimming whitespace and converting to lower case. This is crucial.
            const productCategory = product.category.trim().toLowerCase();
            const selected = selectedCategory.trim().toLowerCase();
            return productCategory === selected;
        });
    
    // --- DYNAMIC TITLE LOGIC ---
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
                    {/* This correctly shows the count of filtered items */}
                    <p>Showing {filteredProducts.length} of {allProducts.length} results</p>
                    <select className="sort-dropdown">
                        <option value="default">Sort by: Default</option>
                    </select>
                </div>
                
                {/* --- CORRECTED RENDER STRUCTURE --- */}
                <div className="product-grid-section">
                    <h2 className="grid-title">{gridTitle}</h2>
                    {/* Ensure you are passing the 'filteredProducts' array here, NOT 'allProducts' */}
                    <ProductGrid products={filteredProducts} />
                </div>
            </main>
        </div>
    );
};

export default ShopPage;