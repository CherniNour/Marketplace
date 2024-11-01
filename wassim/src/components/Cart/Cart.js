import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import React from "react";
import './Cart.css';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 

// Define your product data as an array of dictionaries
const products = [
    {
        id: 1,
        name: "Iphone 11 pro",
        description: "256GB, Navy Blue",
        quantity: 2,
        price: 900,
        image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
    },
    {
        id: 2,
        name: "Samsung Galaxy Note 10",
        description: "256GB, Navy Blue",
        quantity: 2,
        price: 900,
        image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img2.webp"
    },
    {
        id: 3,
        name: "Canon EOS M50",
        description: "Onyx Black",
        quantity: 1,
        price: 1199,
        image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img3.webp"
    },
    {
        id: 4,
        name: "Iphone 11 pro",
        description: "256GB, Navy Blue",
        quantity: 2,
        price: 900,
        image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
    },
    {
        id: 5,
        name: "MacBook Pro",
        description: "1TB, Graphite",
        quantity: 1,
        price: 1799,
        image: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img4.webp"
    }
];

function Cart() {
    // Calculate subtotal
    const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

    return (
        <div>
            {/* Header */}
            <PageHeader />

            <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol>
                            <MDBCard>
                                <MDBCardBody className="p-4">
                                    <MDBRow>
                                        <MDBCol lg="7">
                                            <MDBTypography tag="h5">
                                                <a href="#!" className="text-body">
                                                    <MDBIcon fas icon="long-arrow-alt-left me-2" /> Continue shopping
                                                </a>
                                            </MDBTypography>
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div>
                                                    <p className="mb-1">Shopping cart</p>
                                                    <p className="mb-0">You have {products.length} items in your cart</p>
                                                </div>
                                            </div>

                                            {products.map((product) => (
                                                <MDBCard key={product.id} className="mb-3">
                                                    <MDBCardBody>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <MDBCardImage
                                                                    src={product.image}
                                                                    fluid
                                                                    className="rounded-3"
                                                                    style={{ width: "65px" }}
                                                                    alt={product.name}
                                                                />
                                                                <div className="ms-3">
                                                                    <MDBTypography tag="h5">{product.name}</MDBTypography>
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
                                                                        ${product.price}
                                                                    </MDBTypography>
                                                                </div>
                                                                <a href="#!" style={{ color: "#cecece" }}>
                                                                    <MDBIcon fas icon="trash-alt" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            ))}
                                        </MDBCol>

                                        <MDBCol lg="5">
                                            <MDBCard className="bg-primary text-white rounded-3">
                                                <MDBCardBody>
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <MDBTypography tag="h5" className="mb-0">
                                                            Card details
                                                        </MDBTypography>
                                                        <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                                                            fluid className="rounded-3" style={{ width: "45px" }} alt="Avatar" />
                                                    </div>

                                                    <form className="mt-4">
                                                        <MDBInput className="mb-4" label="Cardholder's Name" type="text" size="lg" placeholder="Cardholder's Name" contrast />
                                                        <MDBInput className="mb-4" label="Card Number" type="text" size="lg" minLength="19" maxLength="19" placeholder="1234 5678 9012 3457" contrast />
                                                        <MDBRow className="mb-4">
                                                            <MDBCol md="6">
                                                                <MDBInput className="mb-4" label="Expiration" type="text" size="lg" minLength="7" maxLength="7" placeholder="MM/YYYY" contrast />
                                                            </MDBCol>
                                                            <MDBCol md="6">
                                                                <MDBInput className="mb-4" label="Cvv" type="text" size="lg" minLength="3" maxLength="3" placeholder="&#9679;&#9679;&#9679;" contrast />
                                                            </MDBCol>
                                                        </MDBRow>
                                                    </form>

                                                    <hr />
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Subtotal</p>
                                                        <p className="mb-2">${subtotal.toFixed(2)}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Shipping</p>
                                                        <p className="mb-2">$20.00</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <p className="mb-2">Total (Incl. taxes)</p>
                                                        <p className="mb-2">${(subtotal + 20).toFixed(2)}</p>
                                                    </div>

                                                    <MDBBtn color="info" block size="lg">
                                                        <div className="d-flex justify-content-between">
                                                            <span>${(subtotal + 20).toFixed(2)}</span>
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

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Cart;
