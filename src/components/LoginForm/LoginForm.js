import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTypography,
} from 'mdb-react-ui-kit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Fetch the user's document to check the role
        const userDoc = await getDoc(doc(db, "User", auth.currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            sessionStorage.setItem('userRole', 'admin'); // Store role in session storage
          }
          navigate('/home');
        } else {
          setErrorMessage('You must sign up first.');
        }
      } catch (error) {
        console.error('Error logging in:', error.message);
        setErrorMessage('Invalid email or password.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <MDBCard style={{ maxWidth: '700px', borderRadius: '15px' }}>
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
            <MDBCardBody className='d-flex flex-column justify-content-start'>
              <div className='d-flex flex-row mt-2'>
                <img src='my-icon.ico' alt="Icon"/>
              </div>
              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>

              {errorMessage && (
                <MDBTypography tag='h6' style={{ color: 'red', marginBottom: '1rem' }}>
                  {errorMessage}
                </MDBTypography>
              )}

              <form onSubmit={handleSubmit}>
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Email address' 
                  id='formControlLg' 
                  type='email' 
                  size="lg" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Password' 
                  id='formControlLg' 
                  type='password' 
                  size="lg" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
