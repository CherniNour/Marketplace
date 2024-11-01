import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from 'mdb-react-ui-kit';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Check if email and password fields are filled
    if (email && password) {
      // Navigate to the homepage
      navigate('/home');
    } else {
      alert('Please fill in all required fields.'); // Alert user to fill fields
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"> {/* Full height and centered container */}
      <MDBCard style={{ maxWidth: '700px', borderRadius: '15px' }}> {/* Adjust width and border-radius */}
        <MDBRow className='g-0'>

          <MDBCol md='6'>
            <MDBCardImage 
              src='./marketplace-login.png' 
              alt="El Hanout marketplace" 
              className='rounded-start w-100 h-100' 
              style={{ objectFit: 'cover' }} 
            />
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column justify-content-start'> {/* Align content to the top */}
              <div className='d-flex flex-row mt-2'>
                <img src='my-icon.ico' alt="Icon"/>
              </div>
              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>

              <form onSubmit={handleSubmit}> {/* Wrap input fields in a form */}
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Email address' 
                  id='formControlLg' 
                  type='email' 
                  size="lg" 
                  pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" 
                  title="Please enter a valid Gmail address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Password' 
                  id='formControlLg' 
                  type='password' 
                  size="lg" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />

                <MDBBtn className="mb-4 px-5" color='dark' size='lg' type="submit"> 
                  Login
                </MDBBtn>
              </form>

              <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                Don't have an account? <Link to="/signup" style={{ color: '#393f81' }}>Register here</Link>
              </p>

              <div className='d-flex flex-row justify-content-start'>
                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                <a href="#!" className="small text-muted">Privacy policy</a>
              </div>
            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>
    </div>
  );
}

export default LoginForm;
