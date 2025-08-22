import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct

import CartSidebar from '../component/CartSidebar';
import AddressFlowModal from '../component/AddressFlowModal';
import './ShopPage.css';

// --- Placeholder Components (replace with your actual components) ---
const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => (
    <div className="category-filter-mock">
        <h4>Categories</h4>
        <ul>
            <li onClick={() => onCategorySelect('All')} className={selectedCategory === 'All' ? 'active' : ''}>All</li>
            {categories.map(cat => (
                <li key={cat.id} onClick={() => onCategorySelect(cat.name)} className={selectedCategory === cat.name ? 'active' : ''}>
                    {cat.name}
                </li>
            ))}
        </ul>
    </div>
);

const FilteredProductGrid = ({ products, title }) => (
    <div className="product-grid-mock">
        <h3>{title}</h3>
        {products.length > 0 ? <p>{products.length} products would be displayed here.</p> : <p>No products in this category.</p>}
    </div>
);
// --- End Placeholders ---


const ShopPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [isCartOpen, setCartOpen] = useState(false);
    const [isAddressModalOpen, setAddressModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // MOCKING a successful fetch since we don't have live DB access
                // In your real app, your original code works fine.
                const productsPromise = Promise.resolve({ docs: [] }); //getDocs(collection(db, 'PartyProducts'));
                const categoriesPromise = Promise.resolve({ docs: [{id: 'cat1', data: () => ({name: 'Fruits'})}] }); //getDocs(collection(db, 'Category Party'));

                const [productsSnapshot, categoriesSnapshot] = await Promise.all([
                    productsPromise,
                    categoriesPromise,
                ]);

                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setAllProducts(productsData);
                setCategories(categoriesData);

            } catch (error) {
                setFetchError(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
    }, [location.state]);

    const handleAddAddressClick = () => {
        setCartOpen(false);
        setAddressModalOpen(true);
    };

    const handleAddressSavedAndNavigate = (savedAddress) => {
        setAddressModalOpen(false);
        navigate('/order-summary', {
            state: {
                deliveryAddress: savedAddress.addressString,
                fullAddress: savedAddress
            }
        });
    };

    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter(product => product.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase());

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
                    <button className="view-cart-btn" onClick={() => setCartOpen(true)}>View Cart</button>
                    <p>Showing {filteredProducts.length} of {allProducts.length} results</p>
                </div>
                {fetchError && <div className="error-message">{fetchError}</div>}
                <FilteredProductGrid
                    products={filteredProducts}
                    title={gridTitle}
                />
            </main>
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setCartOpen(false)}
                onAddAddressClick={handleAddAddressClick}
            />
            <AddressFlowModal
                isOpen={isAddressModalOpen}
                onClose={() => setAddressModalOpen(false)}
                onSaveSuccess={handleAddressSavedAndNavigate}
            />
        </div>
    );
};

export default ShopPage;