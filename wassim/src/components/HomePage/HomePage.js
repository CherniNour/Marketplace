import React from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import Navbar from '../Navbar/Navbar';

function HomePage() {

    return (
        <div>
            {/* Header */}
            <PageHeader />

            <Navbar />

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default HomePage;
