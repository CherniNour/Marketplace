import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBInput,
  MDBRow,
} from 'mdb-react-ui-kit';
import { auth, db } from '../../firebase.config'; // Adjust the path as needed
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
    postalCode: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    if (formData.username && formData.phone && formData.address && formData.postalCode) {
      setStep(2);
      setFormData((prevData) => ({
        ...prevData,
        email: '',
        password: '',
        confirmPassword: '',
      }));
    } else {
      alert('Please fill in all required fields in step 1.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check valid password
    const hasLower = /[a-z]/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    if (formData.password.length < 8 || !hasLower || !hasUpper) {
      setPasswordError(true);
      alert('Passwords should contain at least 8 characters in both Upper and Lower case!');
      return; 
    } else {
      setPasswordError(false);
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError(true);
      alert('Passwords do not match!');
      return;
    } else {
      setConfirmPasswordError(false);
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create a new document in Firestore under the "User" collection with the user information
      await setDoc(doc(db, "User", user.uid), {
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        email: formData.email,
        role: 'client',
      });

      // Create an empty cart for the new user in the "Panier" collection
      await setDoc(doc(db, "Panier", user.uid), {
        userId: user.uid,
        items: [], // Array to hold cart items
        nbrOfLines: 0 // Initialize line count as 0
      });

      console.log('User and cart created successfully:', user);
      navigate('/login'); // Redirect after successful signup
    } catch (error) {
      console.error('Error signing up:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <MDBCard style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="./marketplace-login.png"
              alt="El Hanout marketplace"
              className="rounded-start w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column justify-content-start">
              <div className="d-flex flex-row mt-2">
                <img src="my-icon.ico" alt="Icon" />
              </div>
              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                {step === 1 ? 'Sign up for your account' : 'Create your account'}
              </h5>

              {step === 1 ? (
                <>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBBtn className="mb-4 px-5" color="dark" size="lg" onClick={handleNext}>
                    Next
                  </MDBBtn>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    size="lg"
                    required
                    style={{
                      borderColor: confirmPasswordError ? 'red' : '',
                    }}
                  />
                 
                  <MDBBtn className="mb-4 px-5" color="dark" size="lg" type="submit">
                    Create Account
                  </MDBBtn>
                </form>
              )}
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </div>
  );
}

export default SignupForm;
