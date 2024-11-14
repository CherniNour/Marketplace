import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import PacmanLoader from 'react-spinners/PacmanLoader';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'Product');
        const productSnapshot = await getDocs(productsCollection);

        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setError("Erreur de chargement des données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const productDocRef = doc(db, 'Product', productId);
      await deleteDoc(productDocRef);
      setProducts(products.filter(product => product.id !== productId));
      alert("Produit supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
      alert("Erreur lors de la suppression du produit.");
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
      <h2>Liste des Produits</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nom du Produit</th>
            <th>Catégorie</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(product => (
              <tr key={product.id}>
                <td>{product.Product_name}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  {product.image ? (
                    <img src={product.image} alt={product.Product_name} style={{ width: '100px', height: 'auto' }} />
                  ) : (
                    'Aucune image'
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Aucun produit trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
