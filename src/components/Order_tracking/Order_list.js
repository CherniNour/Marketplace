 
import React, { useState, useEffect } from "react";
import { MDBListGroup, MDBListGroupItem, MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import { auth, db } from "../../firebase.config.mjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import Order from "./Order_tracking"; 
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
 
  return (
    <>
      <PageHeader />
      <MDBContainer className="py-5" style={{ maxWidth: "900px" }}>
        {selectedOrder ? (
          <div>
 
            <Order order={selectedOrder} />
          </div>
        ) : (
          <MDBListGroup
            className="mx-auto"
            style={{
              maxWidth: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {orders.map((order) => (
              <MDBListGroupItem
                key={order.id}
                className="d-flex justify-content-between align-items-center mb-4"
                style={{
                  cursor: "pointer",
                  border: "1px solid #e3e6f0",
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#fff",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onClick={() => handleOrderClick(order)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {/* Display Product Image */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <img
                    src={order.items[0]?.image || "/placeholder-image.jpg"}
                    alt="Product"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                    }}
                  />
                  <div>
                    <h5
                      className="mb-2"
                      style={{
                        color: "#495057",
                        fontWeight: "700",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "1.2rem",
                      }}
                    >
                      {new Date(order.orderDate?.seconds * 1000).toLocaleDateString()}
                    </h5>
                    <p
                      className="mb-0 text-muted"
                      style={{
                        fontSize: "1rem",
                        fontStyle: "italic",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {order.items.map((item) => item.Product_name).join(", ")}
                    </p>
                  </div>
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
                    fontSize: "1rem",
                    padding: "10px 15px",
                  }}
                >
                  {order.status}
                </MDBBadge>
              </MDBListGroupItem>
            ))}
          </MDBListGroup>
        )}
      </MDBContainer>
      <Footer />
    </>
  );
}