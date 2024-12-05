import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
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

        const productList = [];

        for (const productDoc of productSnapshot.docs) {
          const productData = productDoc.data();
          const userID = productData.userID; // Get userID from the Product document

          let username = 'Unknown User'; // Default value in case of issues
          if (userID) {
            try {
              const userDocRef = doc(db, 'User', userID); // Reference to the user document in Users collection
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                username = userDoc.data().username; // Fetch the username
              }
            } catch (userError) {
              console.error(`Error fetching user with ID ${userID}:`, userError);
            }
          }

          productList.push({
            id: productDoc.id,
            ...productData,
            username, // Attach the product owner's username
          });
        }

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Data loading error. Please try again later.");
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
      alert("Product successfully deleted.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product.");
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
      <h2>Product List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Product Owner</th> 
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
                    'No image'
                  )}
                </td>
                <td>{product.username}</td> {/* Display the fetched user name */}
                <td>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
