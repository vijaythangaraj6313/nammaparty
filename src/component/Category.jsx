import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Category.css';

// --- CHANGE 1: Import the useNavigate hook ---
import { useNavigate } from "react-router-dom";

import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0); 
    
    // --- CHANGE 2: Initialize the navigate function ---
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Category Party"));
                const categoriesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    icon: doc.data().imageUrl, 
                }));
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setActiveIndex(0);
                }
            } catch (error) {
                console.error("Error fetching categories from Firestore: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // --- CHANGE 3: Create a new handler for clicking a category ---
    const handleCategoryClick = (categoryName, index) => {
        // This sets the active style locally
        setActiveIndex(index);
        
        // This navigates to the shop page and passes the category name in the 'state' object
        navigate('/shop', { state: { category: categoryName } });
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: '0px',
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } }
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="category-section">
            <h2 className="section-title">Shop by Category</h2>
            <Slider {...settings}>
                {categories.map((category, index) => (
                    // --- CHANGE 4: Update onClick to use the new handler ---
                    <div key={category.id} onClick={() => handleCategoryClick(category.name, index)}>
                        <div className={`category-item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="icon-container">
                                <img src={category.icon} alt={category.name} className="category-icon" />
                            </div>
                            <h3 className="category-name">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Category;