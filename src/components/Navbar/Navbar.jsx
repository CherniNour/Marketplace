import React, { useState, useEffect } from 'react';
import { MDBTabs, MDBTabsItem, MDBTabsLink } from 'mdb-react-ui-kit';
import AllProducts from '../HomePage/AllProducts';
import { db } from '../../firebase.config.mjs';
import { collection, getDocs } from 'firebase/firestore';

const Navbar = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState(['All']);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesCollection = collection(db, 'Categories');
                const categorySnapshot = await getDocs(categoriesCollection);
                const dynamicCategories = categorySnapshot.docs.map((doc) => doc.data().name.trim());
                setCategories(['All', ...dynamicCategories]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleTabClick = (category) => {
        setActiveTab(category);
        onCategoryChange(category); // Notify HomePage of the selected category
    };

    return (
        <div>
            {/* Tabs for categories */}
            <div className="d-flex justify-content-center mb-4">
                <MDBTabs pills>
                    {categories.map((category) => (
                        <MDBTabsItem key={category}>
                            <MDBTabsLink
                                onClick={() => handleTabClick(category)}
                                active={activeTab === category}
                            >
                                {category}
                            </MDBTabsLink>
                        </MDBTabsItem>
                    ))}
                </MDBTabs>
            </div>

            {/* Render AllProducts dynamically based on the active category */}
            <AllProducts selectedCategory={activeTab} />
        </div>
    );
};

export default Navbar;
