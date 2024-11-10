import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBInput } from 'mdb-react-ui-kit';
import { app } from '../../firebaseConfig'; // Import your Firebase configuration

const db = getFirestore(app); // Initialize Firestore

function Update() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, 'user', 'userID'); // Replace 'userID' with the actual user ID
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      const userDoc = doc(db, 'user', 'userID'); // Replace 'userID' with the actual user ID
      await updateDoc(userDoc, userInfo);
      console.log("User info updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <div><PageHeader /></div>
      <div>
        <div className="gradient-custom-2" style={{ backgroundColor: '#f1f2f6' }}>
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="9" xl="7">
                <MDBCard>
                  <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                    <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                      <MDBCardImage 
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                        alt="Generic placeholder image" 
                        className="mt-4 mb-2 img-thumbnail" 
                        fluid 
                        style={{ width: '150px', zIndex: '1' }} 
                      />
                      <MDBBtn outline color="dark" style={{ height: '36px', overflow: 'visible' }} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </MDBBtn>
                    </div>
                    <div className="ms-3" style={{ marginTop: '130px' }}>
                      <MDBTypography tag="h5">{userInfo.username}</MDBTypography>
                      <MDBCardText>{userInfo.address}</MDBCardText>
                    </div>
                  </div>
                  <MDBCardBody className="text-black p-4" style={{ backgroundColor: '#f1f2f6' }}>
                    <div className="mb-5">
                      <p className="lead fw-normal mb-1">About</p>
                      <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {isEditing ? (
                          <form onSubmit={handleSubmit}>
                            <MDBInput className="mb-3" label="User Name" name="username" value={userInfo.username} onChange={handleChange} />
                            <MDBInput className="mb-3" label="Phone Number" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} />
                            <MDBInput className="mb-3" label="Address" name="address" value={userInfo.address} onChange={handleChange} />
                            <MDBInput className="mb-3" label="Postal Code" name="postalCode" value={userInfo.postalCode} onChange={handleChange} />
                            <MDBInput className="mb-3" label="Email" name="email" type="email" value={userInfo.email} onChange={handleChange} />
                            <MDBInput className="mb-3" label="Password" name="password" type="password" value={userInfo.password} onChange={handleChange} />
                            <MDBBtn type="submit" color="primary">Save Changes</MDBBtn>
                          </form>
                        ) : (
                          <>
                            <MDBCardText className="font-italic mb-1"><strong>User Name:</strong> {userInfo.username}</MDBCardText>
                            <MDBCardText className="font-italic mb-1"><strong>Phone Number:</strong> {userInfo.phoneNumber}</MDBCardText>
                            <MDBCardText className="font-italic mb-1"><strong>Address:</strong> {userInfo.address}</MDBCardText>
                            <MDBCardText className="font-italic mb-1"><strong>Postal Code:</strong> {userInfo.postalCode}</MDBCardText>
                            <MDBCardText className="font-italic mb-1"><strong>Email:</strong> {userInfo.email}</MDBCardText>
                            <MDBCardText className="font-italic mb-0"><strong>Password:</strong> {userInfo.password}</MDBCardText>
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
      </div>
      <div><Footer /></div>
    </div>
  );
}

export default Update;
