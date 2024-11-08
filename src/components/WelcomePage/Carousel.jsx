import React from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './carousel.css';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';

export default function App() {
    return (
      <MDBCarousel showIndicators showControls>
        <MDBCarouselItem itemId={1}>
          <img src='/caroussel_electronics.png' className='d-block w-100 carousel-img' alt='...' />
          
        </MDBCarouselItem>
  
        <MDBCarouselItem itemId={2}>
          <img src='/carousel_clothing.png' className='d-block w-100 carousel-img' alt='...' />
          
        </MDBCarouselItem>
  
        <MDBCarouselItem itemId={3}>
          <img src='/carousel_sports_outdours.png' className='d-block w-100 carousel-img' alt='...' />
          
        </MDBCarouselItem>
      </MDBCarousel>
    );
  }