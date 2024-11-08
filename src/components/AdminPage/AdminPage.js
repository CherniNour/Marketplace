import React from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 


function Admin() {
    return (
        <div>
            {/* Header */}
            <PageHeader />

            <div><h1>Welcome Admin !</h1></div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Admin;