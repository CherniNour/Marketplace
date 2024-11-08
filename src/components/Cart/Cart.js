import React, { useEffect, useState } from 'react';
import { 
    MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBRow, MDBTypography, 
    MDBIcon, MDBBtn, MDBInput 
} from "mdb-react-ui-kit";
import { useCart } from '../CartContext/CartContext';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import { auth, db } from '../../firebase.config';
import { doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore';

function Cart() {
    const { cartItems, setCartItems, setCartCount } = useCart();
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (auth.currentUser) {
                const cartDoc = await getDoc(doc(db, "Panier", auth.currentUser.uid));
                if (cartDoc.exists()) {
                    const cartData = cartDoc.data();
                    setCartItems(cartData.items || []);
                    setCartCount(cartData.nbroflines || 0);
                } else {
                    console.log("No cart found for user:", auth.currentUser.uid);
                    setCartItems([]);
                    setCartCount(0);
                }
            }
        };

        fetchCartItems();
    }, [setCartItems, setCartCount]);

    useEffect(() => {
        const total = cartItems.reduce((acc, product) => acc + (parseFloat(product.price) * product.quantity), 0);
        setSubtotal(total);
    }, [cartItems]);

    const handleDelete = async (product) => {
        try {
            setCartItems((prevItems) => prevItems.filter((item) => item.title !== product.title));
            setCartCount((prevCount) => prevCount - product.quantity);

            const userUid = auth.currentUser.uid;
            const cartRef = doc(db, "Panier", userUid);
            await updateDoc(cartRef, {
                items: arrayRemove(product),
                nbroflines: (cartItems.length - 1)
            });

            console.log("Item successfully removed from Firestore and local cart");
        } catch (error) {
            console.error("Error removing item from Firestore:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <PageHeader />

            <section className="h-100 h-custom flex-grow-1" style={{ backgroundColor: "#eee" }}>
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol>
                            <MDBCard>
                                <MDBCardBody className="p-4">
                                    <MDBRow>
                                        {/* Cart Items Section */}
                                        <MDBCol lg="7">
                                            <MDBTypography tag="h5">
                                                <a href="/home" className="text-body">Continue shopping</a>
                                            </MDBTypography>
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div>
                                                    <p className="mb-1">Shopping cart</p>
                                                    <p className="mb-0">You have {cartItems.length} items in your cart</p>
                                                </div>
                                            </div>

                                            {cartItems.map((product, index) => (
                                                <MDBCard key={index} className="mb-3">
                                                    <MDBCardBody>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <MDBCardImage
                                                                    src={product.image}
                                                                    fluid
                                                                    className="rounded-3"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                                    alt={product.title}
                                                                />
                                                                <div className="ms-3">
                                                                    <MDBTypography tag="h5">{product.title}</MDBTypography>
                                                                    <p className="small mb-0">{product.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-row align-items-center">
                                                                <div style={{ width: "50px" }}>
                                                                    <MDBTypography tag="h5" className="fw-normal mb-0">
                                                                        {product.quantity}
                                                                    </MDBTypography>
                                                                </div>
                                                                <div style={{ width: "80px" }}>
                                                                    <MDBTypography tag="h5" className="mb-0">
                                                                        {product.price}DT
                                                                    </MDBTypography>
                                                                </div>
                                                                <a onClick={() => handleDelete(product)} style={{ color: "#cecece", cursor: "pointer" }}>
                                                                    <MDBIcon fas icon="trash-alt"/>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            ))}
                                        </MDBCol>

                                        {/* Card Details Section */}
                                        <MDBCol lg="5">
                                            <MDBCard className="rounded-3 mt-3" style={{ backgroundColor: "#f8f9fa" }}>
                                                <MDBCardBody className="p-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <MDBTypography tag="h4" className="font-weight-bold">
                                                            Card Details
                                                        </MDBTypography>
                                                    </div>
                                                    <p className="small">Card type</p>
                                                    <div>
                                                        <MDBIcon fab icon="cc-mastercard fa-2x me-2" />
                                                        <MDBIcon fab icon="cc-visa fa-2x me-2" />
                                                        <MDBIcon fab icon="cc-amex fa-2x me-2" />
                                                        <MDBIcon fab icon="cc-paypal fa-2x me-2" />
                                                    </div>

                                                    <form className="mt-4">
                                                        <MDBInput className="mb-4" label="Cardholder's Name" type="text" size="lg" placeholder="Cardholder's Name" />

                                                        <MDBInput className="mb-4" label="Card Number" type="text" size="lg" minLength="19" maxLength="19" placeholder="1234 5678 9012 3457" />

                                                        <MDBRow className="mb-4">
                                                            <MDBCol md="6">
                                                                <MDBInput label="Expiration" type="text" size="lg" minLength="7" maxLength="7" placeholder="MM/YYYY" />
                                                            </MDBCol>
                                                            <MDBCol md="6">
                                                                <MDBInput label="Cvv" type="text" size="lg" minLength="3" maxLength="3" placeholder="•••" />
                                                            </MDBCol>
                                                        </MDBRow>
                                                    </form>

                                                    <hr />

                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Subtotal</p>
                                                        <p className="mb-2">{subtotal.toFixed(2)}DT</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Shipping</p>
                                                        <p className="mb-2">07.00DT</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Total (Incl. taxes)</p>
                                                        <p className="mb-2">{(subtotal + 7).toFixed(2)}DT</p>
                                                    </div>

                                                    <MDBBtn color="info" block size="lg">
                                                        <div className="d-flex justify-content-between">
                                                            <span>{(subtotal + 7).toFixed(2)}DT</span>
                                                            <span>Checkout <i className="fas fa-long-arrow-alt-right ms-2"></i></span>
                                                        </div>
                                                    </MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            <Footer />
        </div>
    );
}

export default Cart;
