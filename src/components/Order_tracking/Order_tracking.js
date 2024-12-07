import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase.config.mjs"; // Chemin vers votre configuration Firebase
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./Order_tracking.css";
 
export default function Order({ order }) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [successCancelMessage, setSuccessCancelMessage] = useState(false);
  const [successReceivedMessage, setSuccessReceivedMessage] = useState(false);
  const navigate = useNavigate();
 
  if (!order) {
    return <p>No order selected.</p>;
  }
 
  const handleCancelClick = () => {
    setShowCancelAlert(true);
  };
 
  const confirmCancel = async () => {
    try {
      const orderRef = doc(db, "Orders", order.id); // Remplacez "Orders" par votre collection
      await deleteDoc(orderRef);
 
      // Affiche un message de succès
      setSuccessCancelMessage(true);
 
      // Masque l'alerte après 2 secondes et redirige
      setTimeout(() => {
        setSuccessCancelMessage(false);
        navigate("/home");
      }, 700);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };
 
  const cancelAlert = () => {
    setShowCancelAlert(false);
  };
 
  const handleReceivedOrder = async () => {
    try {
      const orderRef = doc(db, "Orders", order.id);
      await updateDoc(orderRef, { status: "Recieved" });
 
      // Affiche un message de confirmation
      setSuccessReceivedMessage(true);
 
      // Masque l'alerte après 2 secondes et redirige
      setTimeout(() => {
        setSuccessReceivedMessage(false);
        navigate("/home");
      }, 700);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };
 
  return (
    <>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100 mb-4">
          <MDBCol md="12" lg="11" xl="10">
            <MDBCard className="card-stepper" style={{ borderRadius: "16px", maxWidth: "100%" }}>
              <MDBCardHeader className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      Order ID <span className="fw-bold text-body">{order.id}</span>
                    </p>
                    <p className="text-muted mb-0">
                      Placed On{" "}
                      <span className="fw-bold text-body">
                        {order.orderDate
                          ? new Date(order.orderDate.seconds * 1000).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <MDBTypography tag="h5" className="fw-normal mb-0">
                      <a
                        href="/My-orders"
                        style={{ color: "#333", textDecoration: "none" }}
                      >
                        Back to Orders
                      </a>
                    </MDBTypography>
                  </div>
                </div>
              </MDBCardHeader>
              <MDBCardBody className="p-4">
                {order.items.map((item, index) => (
                  <div
                    className="d-flex flex-row mb-4 pb-2"
                    key={`${order.id}-item-${index}`}
                  >
                    <div className="flex-fill">
                      <MDBTypography tag="h5" className="bold">
                        {item.Product_name}
                      </MDBTypography>
                      <p className="text-muted">Qt: {item.quantity} item(s)</p>
                      <MDBTypography tag="h4" className="mb-3">
                        {item.price} DT
                      </MDBTypography>
                      <p className="text-muted">
                        Tracking Status:{" "}
                        <span className="text-body">
                          {order.trackingStatus || order.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <MDBCardImage
                        fluid
                        className="align-self-center"
                        src={item.image || "default-image-url"}
                        style={{ width: "120px", height: "120px" }}
                      />
                    </div>
                  </div>
                ))}
              </MDBCardBody>
              <MDBCardFooter className="p-4">
  <div className="d-flex justify-content-between align-items-center">
    {order.status === "Recieved" ? (
      <span
        style={{
          backgroundColor: "#ccc",
          color: "#333",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "not-allowed",
        }}
      >
        Order received
      </span>
    ) : (
      <>
        <button
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
          onClick={handleReceivedOrder}
        >
          I received my order
        </button>
        <a
          href="#!"
          style={{
            color: "#FF5733",
            textDecoration: "none",
            padding: "10px 20px",
          }}
          onClick={handleCancelClick}
        >
          Cancel
        </a>
      </>
    )}
  </div>
</MDBCardFooter>
 
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
 
      {/* Confirmation Alert */}
      {showCancelAlert && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
            Are you sure you want to cancel this order?
          </p>
          <div className="d-flex justify-content-between mt-3">
            <button
              style={{
                backgroundColor: "#FF5733",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              onClick={confirmCancel}
            >
              Yes, Cancel
            </button>
            <button
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              onClick={cancelAlert}
            >
              No
            </button>
          </div>
        </div>
      )}
 
      {/* Success Cancel Alert */}
      {successCancelMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#FF5733",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Your order has been successfully canceled!
        </div>
      )}
 
      {/* Success Received Alert */}
      {successReceivedMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          We're happy to have you shopping with us!
        </div>
      )}
    </>
  );
}