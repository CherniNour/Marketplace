import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
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
        console.error("Erreur lors de la récupération des clients :", error);
        setError("Erreur de chargement des données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    try {
      // Supprimer l'utilisateur
      const clientDocRef = doc(db, 'User', clientId);
      await deleteDoc(clientDocRef);
      setClients(clients.filter(client => client.id !== clientId));
      alert("Utilisateur supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  const handleUpdateRole = async (clientId, newRole) => {
    try {
      // Mettre à jour le rôle de l'utilisateur
      const clientDocRef = doc(db, 'User', clientId);
      await updateDoc(clientDocRef, { role: newRole });
      setClients(clients.map(client => 
        client.id === clientId ? { ...client, role: newRole } : client
      ));
      alert("Rôle mis à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      alert("Erreur lors de la mise à jour du rôle.");
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
      <h2>Liste des Clients</h2>
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
                  {/* Bouton pour changer le rôle en 'admin' */}
                  <button
                    onClick={() => handleUpdateRole(client.id, 'admin')}
                    disabled={client.role === 'admin'}
                    className="btn btn-primary btn-sm"
                  >
                    Promouvoir en Admin
                  </button>
                  {/* Bouton pour supprimer un utilisateur */}
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: '10px' }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucun client trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsPage;