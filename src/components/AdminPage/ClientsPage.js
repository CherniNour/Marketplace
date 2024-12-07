import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config.mjs';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import PacmanLoader from 'react-spinners/PacmanLoader';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsCollection = collection(db, 'User');
        const clientSnapshot = await getDocs(clientsCollection);

        const clientsList = clientSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClients(clientsList);
      } catch (error) {
        console.error("Error while fetching clients:", error);
        setError("Data loading error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    try {
      // Delete the user
      const clientDocRef = doc(db, 'User', clientId);
      await deleteDoc(clientDocRef);
      setClients(clients.filter(client => client.id !== clientId));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error while deleting the user:", error);
      alert("Error while deleting the user.");
    }
  };

  const handleUpdateRole = async (clientId, newRole) => {
    try {
      // Update the user's role
      const clientDocRef = doc(db, 'User', clientId);
      await updateDoc(clientDocRef, { role: newRole });
      setClients(clients.map(client => 
        client.id === clientId ? { ...client, role: newRole } : client
      ));
      alert("Role updated successfully.");
    } catch (error) {
      console.error("Error while updating the role:", error);
      alert("Error while updating the role.");
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
      <h2>Clients List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map(client => (
              <tr key={client.id}>
                <td>{client.username}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>{client.postalCode}</td>
                <td>{client.role}</td>
                <td>
                  {/* Button to promote to 'admin' */}
                  <button
                    onClick={() => handleUpdateRole(client.id, 'admin')}
                    disabled={client.role === 'admin'}
                    className="btn btn-primary btn-sm"
                  >
                    Promote to Admin
                  </button>
                  {/* Button to delete a user */}
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No clients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsPage;
