import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../PageHeader/PageHeader';
import Footer from '../Footer/Footer';
import { useCart } from '../CartContext/CartContext';
import { auth, db } from '../../firebase.config.mjs';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon from react-icons

const ProductDetails = () => {
  const { state } = useLocation(); // Get the state passed from AllProducts.js
  const product = state?.product;
  const { addToCart } = useCart(); 
  const [ownerUsername, setOwnerUsername] = useState('');

  useEffect(() => {
    // Fetch product owner username
    const fetchOwnerUsername = async () => {
      try {
        const userDoc = doc(db, "User", product.userID); // Fetch user data from 'users' collection
        const userSnap = await getDoc(userDoc);
        const userData = userSnap.data();
        setOwnerUsername(userData?.username || 'Unknown'); // Set the username or default to 'Unknown'
      } catch (error) {
        console.error("Error fetching owner username:", error);
      }
    };

    if (product) {
      fetchOwnerUsername();
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in to add items to your cart.");
        return;
    }

    addToCart(product); 

    const cartRef = doc(db, "Panier", user.uid);

    try {
        const productDoc = doc(db, "Product", product.id);
        const productSnap = await getDoc(productDoc);
        const productData = productSnap.data();
        const productOwner = productData?.userID;

        const cartSnap = await getDoc(cartRef);
        const cartData = cartSnap.data();
        const currentItems = cartData?.items || [];
        const currentNbrofLines = cartData?.nbroflines || 0;

        const existingProductIndex = currentItems.findIndex(item => item.Product_name === product.Product_name);

        let updatedItems;

        if (existingProductIndex !== -1) {
            updatedItems = currentItems.map((item, index) => 
                index === existingProductIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedItems = [
                ...currentItems,
                { 
                    Product_name: product.Product_name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                    description: product.description,
                    owner: productOwner 
                }
            ];
        }

        await updateDoc(cartRef, { 
            items: updatedItems, 
            nbroflines: currentNbrofLines + 1
        });
        console.log("Product added to cart successfully.");
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
};

  return (
    <>
      <PageHeader />
      <div className="container my-5 py-3">
      <Helmet>
        <title>{`${product.Product_name} - Buy Online`}</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.Product_name}, ${product.category}, buy ${product.Product_name}, online shopping`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.elhanout.com/product/${product.id}`} />
      </Helmet>
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center mx-auto product">
            <img
              src={product.image}
              alt={product.Product_name}
              style={{ width: "500px", height: "500px", objectFit: "cover" }}
              className="product-image"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="display-5 fw-bold">{product.Product_name}</h1>
            <hr />
            <h2 className="my-4">{product.price} DT</h2>
            <p className="lead">{product.description}</p>
            <p className="text-muted">Owner: {ownerUsername}</p> {/* Display the owner's username */}
            <button 
              className="btn btn-outline-primary d-flex align-items-center px-3 py-2 text-sm" style={{width:'200px'}}
              onClick={() => handleAddToCart(product)}
            >
              <FaShoppingCart className="me-2" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
