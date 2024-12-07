import React, { useState } from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Helmet } from 'react-helmet';


function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <div>
            <Helmet>
                <title>El Hanout - Marketplace for Electronics, Clothing, Sports and Outdoors & More</title>
                <meta name="description" content="Browse and buy the best products in electronics, clothing, sports and much more from El Hanout marketplace." />
                <meta name="keywords" content="electronics, clothing, sports, marketplace, online store, buy products, el hanout" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://el-hanout-57170.web.app/home" />
            </Helmet>
            {/* Header */}
            <PageHeader />

            {/* Navbar with category selection */}
            <Navbar onCategoryChange={setSelectedCategory} />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default HomePage;
