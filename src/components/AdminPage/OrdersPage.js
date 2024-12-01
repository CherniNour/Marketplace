import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import PacmanLoader from 'react-spinners/PacmanLoader';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'Orders');
        const orderSnapshot = await getDocs(ordersCollection);

        const orderList = [];

        // Fetching additional user data for each order
        for (const orderDoc of orderSnapshot.docs) {
          const orderData = orderDoc.data();
          const userDocRef = doc(db, 'User', orderData.userID); // Assuming each order has a userID
          const userDoc = await getDoc(userDocRef);

          const orderWithUser = {
            id: orderDoc.id,
            ...orderData,
            username: userDoc.exists() ? userDoc.data().username : 'Unknown', // Fetch username
          };

          orderList.push(orderWithUser);
        }

        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Data loading error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      const orderDocRef = doc(db, 'Orders', orderId);
      await deleteDoc(orderDocRef);
      setOrders(orders.filter(order => order.id !== orderId));
      alert("Order successfully deleted.");
    } catch (error) {
      console.error("Error deleting the order:", error);
      alert("Error deleting the order.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PacmanLoader color="#36D7B7" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Order List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Details</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.username}</td> {/* Display username from User collection */}
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <p>{item.Product_name}</p>
                      <p>{item.quantity} x {item.price} TND</p>
                      <img src={item.image} alt={item.Product_name} style={{ width: '100px', height: 'auto' }} />
                    </div>
                  ))}
                </td>
                <td>{order.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;
