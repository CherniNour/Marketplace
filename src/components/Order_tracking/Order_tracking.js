import React from "react";
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
import "./Order_tracking.css";

export default function Order({ order }) {
  if (!order) {
    return <p>No order selected.</p>;
  }

  return (
    <>
    <MDBContainer className="py-5 h-100">
      <MDBRow className="justify-content-center align-items-center h-100 mb-4">
        <MDBCol md="12" lg="11" xl="10"> {/* Wider column */}
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
                  {/* 'Back to Orders' button moved to the header */}
                  <MDBTypography tag="h5" className="fw-normal mb-0">
                    <a href="/My-orders" style={{ color: "#333", textDecoration: "none" }}>
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
                      width="120" // Smaller image size
                    />
                  </div>
                </div>
              ))}
            </MDBCardBody>
            <MDBCardFooter className="p-4">
              <div className="d-flex justify-content-between">
                <div className="border-start h-100"></div>
                <MDBTypography tag="h5" className="fw-normal mb-0">
                  {/* Updated Cancel style */}
                  <a
                    href="#!"
                    style={{
                      color: "#FF5733", // Change the color (you can choose another)
                      textDecoration: "none", // Remove the underline
                    }}
                  >
                    Cancel
                  </a>
                </MDBTypography>
                <div className="border-start h-100"></div>
              </div>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </>
  );
}
