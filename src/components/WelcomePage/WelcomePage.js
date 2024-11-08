import React from 'react';
import Carousel from './Carousel';
import { MDBBtn } from 'mdb-react-ui-kit'; 
import './welcomepage.css'; 
import Footer from '../Footer/Footer';


function HomePage() {
    return (
        <div>
           <div className="container-fluid px-4 py-5 my-5 text-center position-relative">
            {/* Login Button at the top right */}
            <div className="position-absolute top-0 end-0 p-3">
                <MDBBtn className="cta-button" color="primary" href="/login">
                    Login
                </MDBBtn>
            </div>

            {/* Logo on the left and Title in the center */}
            <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                {/* Logo on the far left */}
                <div className="position-absolute start-0">
                    <img src='my-icon.ico' alt="El Hanout Logo" className="logo" style={{ width: '300px', height: '300px' }} href="/login"/>
                </div>

                {/* Center the title */}
                <div className="flex-grow-1">
                    <h2 className="display-2 fw-bold text-center">
                        El Hanout <span className="text-primary">Marketplace</span>
                    </h2>
                </div>
            </div>

            <div className="lc-block col-lg-6 mx-auto mb-5">
                <div contentEditable="true">
                    <p className="lead">
                        Your One-Stop Marketplace for Buying and Selling – Where Everyone’s Goods Find a Home!
                    </p>
                </div>
            </div>
        </div> 

            <div className="lc-block d-grid gap-2 d-sm-flex justify-content-sm-center">
                <img 
                    className="img-fluid" 
                    src="https://lclibrary.b-cdn.net/starters/wp-content/uploads/sites/15/2021/10/undraw_going_up_ttm5.svg" 
                    alt="Going Up" 
                    width="" 
                    height="783" 
                />
            </div>

            {/* Center-aligned Categories Section */}
            <div className="text-center my-4">
                <MDBBtn color='primary' className='cta-button2 mx-2' href="/login">Electronics</MDBBtn>
                <MDBBtn color='primary' className='cta-button2 mx-2' href="/login">Clothing</MDBBtn>
                <MDBBtn className='cta-button2 mx-2' color='primary' href="/login">Sports & Outdoors</MDBBtn>
            </div>

            <div className="carousel-container">
                <Carousel />
            </div>

            {/* Button Section */}
            <div className="cta-button-container text-center mt-4">
                <MDBBtn className="cta-button" color="primary" href="/login">Become a Hanouter Now!</MDBBtn>
            </div>

            <div><Footer /></div>
        </div>
    );
}

export default HomePage;
