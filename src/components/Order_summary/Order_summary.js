import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.config.mjs';
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com'; // EmailJS library
import './Order_summary.css';

export default function ConfirmOrder() {
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
          const userRef = doc(db, 'User', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          } else {
            console.log('No such user document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleGoBack = () => {
    navigate('/Your cart');
  };

  const sendOrderConfirmationEmail = (email, username) => {
    const serviceId = 'service_51grp9c'; // Your EmailJS service ID
    const templateId = 'template_6dk91xs'; // Your EmailJS template ID
    const publicKey = 'BBjpBd8ygKJberPrr'; // Your EmailJS public key

    const templateParams = {
      from_name: 'El Hanout Marketplace',
      to_name: username,
      to_email: email,
      message: `Dear ${username},\n\nYour payment was successfully processed. Your order is being prepared and will be delivered to you soon. Thank you for shopping with us at El Hanout Marketplace! If you have any questions, feel free to contact us.\n\nBest regards,\nThe El Hanout Team`,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Order confirmation email sent successfully!', response);
      })
      .catch((error) => {
        console.error('Error sending confirmation email:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const user = auth.currentUser;
        if (!user) {
            alert("You need to be logged in to place an order.");
            return;
        }

        const userID = user.uid;

        // 1. Fetch the current user's cart
        const cartRef = doc(db, "Panier", userID);
        const cartSnap = await getDoc(cartRef);

        if (!cartSnap.exists()) {
            alert("Your cart is empty.");
            return;
        }

        const cartData = cartSnap.data();
        const items = cartData.items || []; // Retrieve the `items` array
        const nbroflines = cartData.nbroflines || 0; // Retrieve the `nbroflines`

        if (items.length === 0 || nbroflines === 0) {
            alert("Your cart is empty.");
            return;
        }

        // 2. Add the order to the Orders collection
        const orderRef = collection(db, "Orders");
        await addDoc(orderRef, {
            userID,
            username: userInfo.username,
            email: userInfo.email,
            address: userInfo.address,
            postalCode: userInfo.postalCode,
            phone: userInfo.phone,
            items, // Add the items array from the cart
            orderDate: new Date(),
            status: "Order Placed",
        });

        // 3. Clear the user's cart (set `items` to an empty array and `nbroflines` to 0)
        await updateDoc(cartRef, {
            items: [],
            nbroflines: 0,
        });

        // 4. Send the order confirmation email
        sendOrderConfirmationEmail(userInfo.email, userInfo.username);

        // 5. Display success alert and navigate back
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
            navigate('/home');
        }, 3000);

        console.log("Order placed successfully, cart emptied, and email sent.");
    } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing your order. Please try again.");
    }
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert">
          <strong>Success!</strong> Your order has been placed successfully.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <div className="mx-auto gradient-custom mt-5" style={{ maxWidth: '800px', height: '400px' }}>
        <MDBRow className="pt-3 mx-3">
          <MDBCol md="3">
            <div className="text-center" style={{ marginTop: '50px', marginLeft: '10px' }}>
              <MDBIcon fas icon="shipping-fast text-white" size="3x" />
              <MDBTypography tag="h3" className="text-white">
                Welcome
              </MDBTypography>
              <p className="white-text">You are 30 seconds away from completing your order!</p>
            </div>
            <div className="text-center">
              <MDBBtn color="white" rounded className="back-button" onClick={handleGoBack}>
                Go back
              </MDBBtn>
            </div>
          </MDBCol>
          <MDBCol md="9" className="justify-content-center">
            <MDBCard className="card-custom pb-4">
              <MDBCardBody className="mt-0 mx-5">
                <div className="text-center mb-3 pb-2 mt-3">
                  <MDBTypography tag="h4" style={{ color: '#495057' }}>
                    Delivery Details
                  </MDBTypography>
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
                    <MDBBtn rounded style={{ backgroundColor: '#0062CC' }} type="submit">
                      Place order
                    </MDBBtn>
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
