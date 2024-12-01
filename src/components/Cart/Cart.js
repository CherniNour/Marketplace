 
import React, { useEffect, useState } from 'react';
import { 
    MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBRow, MDBTypography, 
    MDBIcon, MDBBtn, MDBInput 
} from "mdb-react-ui-kit";
import { useCart } from '../CartContext/CartContext';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import { auth, db } from '../../firebase.config';
import { doc, getDoc, updateDoc, arrayRemove, collection,addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
 
function Cart() {
    const { cartItems, setCartItems, setCartCount } = useCart();
    const [subtotal, setSubtotal] = useState(0);
    const [showCreditCardForm, setShowCreditCardForm] = useState(false);
    const [cardInfo, setCardInfo] = useState({
        name: '',
        number: '',
        expiration: '',
        cvv: ''
    });
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchCartItems = async () => {
            if (auth.currentUser) {
                const cartDoc = await getDoc(doc(db, "Panier", auth.currentUser.uid));
                if (cartDoc.exists()) {
                    const cartData = cartDoc.data();
                    setCartItems(cartData.items || []);
                    setCartCount(cartData.nbroflines || 0);
                } else {
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
            const updatedItems = cartItems.filter((item) => item.Product_name !== product.Product_name);
            const newCartCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
 
            setCartItems(updatedItems);
            setCartCount(newCartCount);
 
            const userUid = auth.currentUser.uid;
            const cartRef = doc(db, "Panier", userUid);
            await updateDoc(cartRef, {
                items: arrayRemove(product),
                nbroflines: newCartCount
            });
        } catch (error) {
            console.error("Error removing item from Firestore:", error);
        }
    };
 
    const updateProductQuantity = async (product, delta) => {
        const updatedItems = cartItems.map((item) =>
            item.Product_name === product.Product_name ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
 
        const newCartCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        setCartItems(updatedItems);
        setCartCount(newCartCount);
 
        const userUid = auth.currentUser.uid;
        const cartRef = doc(db, "Panier", userUid);
        await updateDoc(cartRef, {
            items: updatedItems,
            nbroflines: newCartCount
        });
    };
 
    const handleCardInput = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
    };
 
    const encryptData = (data) => {
        const secretKey = CryptoJS.enc.Utf8.parse('my-secret-key-12345'); // Replace with a secure key
        const iv = CryptoJS.enc.Utf8.parse('my-init-vector-123'); // Replace with a secure IV
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    };
 
    // Example usage in handlePayment
    const handlePayment = async (e) => {
        e.preventDefault();
        if (auth.currentUser) {
            const encrypted = encryptData(cardInfo);
            const userUid = auth.currentUser.uid;
 
            try {
                const CreditCardref =collection(db, 'Credit card');
                await addDoc(CreditCardref, {
                    encryptedCardInfo: encrypted,
                    userId: userUid,
                });
 
                navigate('/order-summary');
            } catch (error) {
                console.error("Error saving credit card info:", error);
            }
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
                                        <MDBCol lg="7">
                                            <MDBTypography tag="h5">
                                                <a href="/home" className="text-body">Continue shopping</a>
                                            </MDBTypography>
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <p className="mb-0">You have {cartItems.length} items in your cart</p>
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
                                                                    alt={product.Product_name}
                                                                />
                                                                <div className="ms-3">
                                                                    <MDBTypography tag="h5">{product.Product_name}</MDBTypography>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-row align-items-center">
                                                                <div style={{ width: "50px", display: "flex", alignItems: "center", marginRight: "15px" }}>
                                                                    <span 
                                                                        onClick={() => updateProductQuantity(product, -1)} 
                                                                        style={{ cursor: "pointer", fontSize: "20px", marginRight: "5px" }}
                                                                    >
                                                                        -
                                                                    </span>
                                                                    <MDBTypography tag="h5" className="fw-normal mb-0 mx-2">
                                                                        {product.quantity}
                                                                    </MDBTypography>
                                                                    <span 
                                                                        onClick={() => updateProductQuantity(product, 1)} 
                                                                        style={{ cursor: "pointer", fontSize: "20px", marginLeft: "5px" }}
                                                                    >
                                                                        +
                                                                    </span>
                                                                </div>
 
                                                                <div style={{ display: "flex", alignItems: "center", minWidth: "80px", justifyContent: "flex-start" }}>
                                                                    <MDBTypography tag="h5" className="mb-0" style={{ whiteSpace: "nowrap" }}>
                                                                        {(parseFloat(product.price) * product.quantity).toFixed(2)}
                                                                    </MDBTypography>
                                                                    <span style={{ marginLeft: "5px", fontSize: "16px", whiteSpace: "nowrap" }}>
                                                                        DT
                                                                    </span>
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
 
                                        <MDBCol lg="5">
                                            <MDBCard className="rounded-3 mt-3" style={{ backgroundColor: "#f8f9fa" }}>
                                                <MDBCardBody className="p-4">
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Subtotal</p>
                                                        <p className="mb-2">{subtotal.toFixed(2)} DT</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Shipping</p>
                                                        <p className="mb-2">07.00 DT</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2 font-weight-bold">Total (Incl. taxes)</p>
                                                        <p className="mb-2 font-weight-bold">{(subtotal + 7).toFixed(2)} DT</p>
                                                    </div>
 
                                                    <hr />
 
                                                    <div className="d-flex flex-column">
                                                        <MDBBtn color="info" block size="lg" onClick={() => navigate('/order-summary')}>
                                                            Pay on Delivery
                                                        </MDBBtn>
                                                        <MDBBtn color="primary" block size="lg" onClick={() => setShowCreditCardForm(true)} className="mt-2">
                                                            Pay Online
                                                        </MDBBtn>
                                                    </div>
 
                                                    {showCreditCardForm && (
                                                        <form onSubmit={handlePayment} className="mt-3">
                                                            <MDBInput
                                                            wrapperClass="mb-4"
                                                            label="Cardholder's Name"
                                                            name="name"
                                                            value={cardInfo.name}
                                                            onChange={handleCardInput}
                                                            required
                                                            pattern="^[a-zA-Z\s]+$"
                                                            title="Name should contain only letters and spaces"
                                                            />
                                                            <MDBInput
                                                            wrapperClass="mb-4"
                                                            label="Card Number"
                                                            name="number"
                                                            value={cardInfo.number}
                                                            onChange={handleCardInput}
                                                            required
                                                            pattern="^\d{16}$"
                                                            title="Card number must contain exactly 16 digits"
                                                            />
                                                            <MDBRow className="mb-4">
                                                            <MDBCol md="6">
                                                                <MDBInput
                                                                wrapperClass="mb-4"
                                                                label="Expiration Date (MM/YY)"
                                                                name="expiration"
                                                                value={cardInfo.expiration}
                                                                onChange={handleCardInput}
                                                                required
                                                                pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                                                                title="Expiration date must be in MM/YY format and valid"
                                                                />
                                                            </MDBCol>
                                                            <MDBCol md="6">
                                                                <MDBInput
                                                                wrapperClass="mb-4"
                                                                label="CVV"
                                                                name="cvv"
                                                                value={cardInfo.cvv}
                                                                onChange={handleCardInput}
                                                                required
                                                                pattern="^\d{3,4}$"
                                                                title="CVV must be 3 or 4 digits"
                                                                />
                                                            </MDBCol>
                                                            </MDBRow>
                                                            <MDBBtn color="success" type="submit" block>
                                                            Submit Payment
                                                            </MDBBtn>
                                                        </form>
                                                        )}
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