import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.config';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import './Order_summary.css';

export default function Confirm_order() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    address: '',
    postalCode: '',
    phone: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "User", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          } else {
            console.log("No such user document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleGoBack = () => {
    navigate('/Your cart');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (user) {
        const userID = user.uid;

        // 1. Fetch items from the user's Panier collection
        const panierRef = collection(db, 'Panier', userID, 'items');
        const panierSnapshot = await getDocs(panierRef);
        const items = panierSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // 2. Add the order to the Orders collection with items array
        const orderRef = collection(db, 'Orders');
        await addDoc(orderRef, {
          userID,
          username: userInfo.username,
          email: userInfo.email,
          address: userInfo.address,
          postalCode: userInfo.postalCode,
          phone: userInfo.phone,
          items, // Adding fetched items to order
          orderDate: new Date(),
          status: "Order Placed"
        });

        // 3. Clear the user's Panier by deleting each item document
        for (const docItem of panierSnapshot.docs) {
          await deleteDoc(docItem.ref);
        }

        // 4. Update the Panier document with nbrOfLines = 0
        const panierDocRef = doc(db, 'Panier', userID);
        await updateDoc(panierDocRef, {
          nbrOfLines: 0
        });

        // Display success alert and navigate to home
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/home');
        }, 3000);

        console.log('Order placed successfully and cart emptied');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert">
          <strong>Success!</strong> Your order has been placed successfully.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}

      <div className="mx-auto gradient-custom mt-5" style={{ maxWidth: '800px', height: '400px' }}>
        <MDBRow className="pt-3 mx-3">
          <MDBCol md="3">
            <div className="text-center" style={{ marginTop: '50px', marginLeft: '10px' }}>
              <MDBIcon fas icon="shipping-fast text-white" size="3x" />
              <MDBTypography tag="h3" className="text-white">Welcome</MDBTypography>
              <p className="white-text">You are 30 seconds away from completing your order!</p>
            </div>
            <div className="text-center">
              <MDBBtn color="white" rounded className="back-button" onClick={handleGoBack}>Go back</MDBBtn>
            </div>
          </MDBCol>
          <MDBCol md="9" className="justify-content-center">
            <MDBCard className="card-custom pb-4">
              <MDBCardBody className="mt-0 mx-5">
                <div className="text-center mb-3 pb-2 mt-3">
                  <MDBTypography tag="h4" style={{ color: '#495057' }}>Delivery Details</MDBTypography>
                </div>

                <form onSubmit={handleSubmit} className="mb-0">
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        label="Username"
                        type="text"
                        value={userInfo.username}
                        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        label="Phone Number"
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        label="Address"
                        type="text"
                        value={userInfo.address}
                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        label="Postal Code"
                        type="text"
                        value={userInfo.postalCode}
                        onChange={(e) => setUserInfo({ ...userInfo, postalCode: e.target.value })}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        label="Email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                    </MDBCol>
                  </MDBRow>

                  <div className="float-end">
                    <MDBBtn rounded style={{ backgroundColor: '#0062CC' }} type="submit">Place order</MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </>
  );
}
