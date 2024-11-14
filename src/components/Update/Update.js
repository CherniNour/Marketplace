import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBInput } from 'mdb-react-ui-kit';

function Update() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    phone: '',
    address: '',
    postalCode: '',
    email: '',
    password: ''
  });

  // Fetch user data from Firestore when the component is mounted
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "User", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.error("No user document found!");
        }
      }
    };
    fetchUserData();
  }, []);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    if (auth.currentUser) {
      try {
        // Update the password if a new one is provided
        if (userInfo.password) {
          await updatePassword(auth.currentUser, userInfo.password);
          console.log("Password updated successfully.");
        }

        // Update the user information in Firestore
        const userDocRef = doc(db, "User", auth.currentUser.uid);
        await setDoc(userDocRef, {
          username: userInfo.username,
          phone: userInfo.phone,
          address: userInfo.address,
          postalCode: userInfo.postalCode,
          email: userInfo.email,
        }, { merge: true });

        console.log("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("There was an issue updating your profile. Please try again.");
      }
    }
  };

  return (
    <div>
      <PageHeader />
      <div className="gradient-custom-2" style={{ backgroundColor: '#f1f2f6' }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                  <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                    <MDBCardImage 
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                      alt="User Profile"
                      className="mt-4 mb-2 img-thumbnail"
                      fluid
                      style={{ width: '150px', zIndex: '1' }}
                    />
                    <MDBBtn outline color="dark" style={{ height: '36px' }} onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </MDBBtn>
                  </div>
                  <div className="ms-3" style={{ marginTop: '130px' }}>
                    <MDBTypography tag="h5">{userInfo.username || "Loading..."}</MDBTypography>
                    <MDBCardText>{userInfo.address || "Loading..."}</MDBCardText>
                  </div>
                </div>
                <MDBCardBody className="text-black p-4" style={{ backgroundColor: '#f1f2f6' }}>
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      {isEditing ? (
                        <form onSubmit={handleSubmit}>
                          <MDBInput className="mb-3" label="User Name" name="username" value={userInfo.username} onChange={handleChange} />
                          <MDBInput className="mb-3" label="Phone Number" name="phone" value={userInfo.phone} onChange={handleChange} />
                          <MDBInput className="mb-3" label="Address" name="address" value={userInfo.address} onChange={handleChange} />
                          <MDBInput className="mb-3" label="Postal Code" name="postalCode" value={userInfo.postalCode} onChange={handleChange} />
                          <MDBInput className="mb-3" label="Email" name="email" type="email" value={userInfo.email} onChange={handleChange} />
                          <MDBInput className="mb-3" label="Password" name="password" type="password" value={userInfo.password} onChange={handleChange} />
                          <MDBBtn type="submit" color="primary">Save Changes</MDBBtn>
                        </form>
                      ) : (
                        <>
                          <MDBCardText className="font-italic mb-1"><strong>User Name:</strong> {userInfo.username}</MDBCardText>
                          <MDBCardText className="font-italic mb-1"><strong>Phone Number:</strong> {userInfo.phone}</MDBCardText>
                          <MDBCardText className="font-italic mb-1"><strong>Address:</strong> {userInfo.address}</MDBCardText>
                          <MDBCardText className="font-italic mb-1"><strong>Postal Code:</strong> {userInfo.postalCode}</MDBCardText>
                          <MDBCardText className="font-italic mb-1"><strong>Email:</strong> {userInfo.email}</MDBCardText>
                          <MDBCardText className="font-italic mb-0"><strong>Password:</strong> ****</MDBCardText> {/* Hide the password */}
                        </>
                      )}
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <Footer />
    </div>
  );
}

export default Update;
