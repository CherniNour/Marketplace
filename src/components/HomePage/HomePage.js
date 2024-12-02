import React from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function HomePage() {
    // Hook pour utiliser les traductions

    return (
        <div>
            {/* Header */}
            <PageHeader /> {/* Transmet la traduction à PageHeader */}

            {/* Navbar */}
            <Navbar />

            {/* Contenu principal */}
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default HomePage;
