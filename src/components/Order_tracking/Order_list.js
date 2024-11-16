import React, { useState, useEffect } from "react";
import { MDBListGroup, MDBListGroupItem, MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import { auth, db } from "../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Order from "./Order_tracking"; // Import your detailed Order Tracking component
import PageHeader from "../PageHeader/PageHeader";
import Footer from "../Footer/Footer";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, "Orders"), where("userID", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  return (
    <MDBContainer className="py-5">
      {selectedOrder ? (
        <div>
          <button
            onClick={handleBackToOrders}
            className="btn btn-primary mb-4"
            style={{ borderRadius: "25px", padding: "10px 20px" }}
          >
            Back to Orders
          </button>
          <Order order={selectedOrder} />
        </div>
      ) : (
        <MDBListGroup
          className="mx-auto"
          style={{
            maxWidth: "600px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {orders.map((order) => (
            <MDBListGroupItem
              key={order.id}
              className="d-flex justify-content-between align-items-center mb-3"
              style={{
                cursor: "pointer",
                border: "1px solid #e3e6f0",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onClick={() => handleOrderClick(order)}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
                e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div>
                <h5
                  className="mb-1"
                  style={{
                    color: "#495057",
                    fontWeight: "600",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {new Date(order.orderDate?.seconds * 1000).toLocaleDateString()}
                </h5>
                <p
                  className="mb-0 text-muted"
                  style={{
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {order.items.map((item) => item.Product_name).join(", ")}
                </p>
              </div>
              <MDBBadge
                pill
                style={{
                  backgroundColor:
                    order.status === "Order Placed"
                      ? "#8bc34a"
                      : order.status === "Shipped"
                      ? "#03a9f4"
                      : "#ffc107",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                {order.status}
              </MDBBadge>
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
      )}
    </MDBContainer>

  );
}
