//update

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, setDoc,updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer"; 
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBInput, MDBIcon } from 'mdb-react-ui-kit';

function Update() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    phone: '',
    address: '',
    postalCode: '',
    email: '',
    password: ''
  });
  const [userProducts, setUserProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "User", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.error("No user document found!");
        }
      }
    };

    const fetchUserProducts = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "Product"), where("userID", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserProducts(products);
      }
    };

    fetchUserData();
    fetchUserProducts();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    if (auth.currentUser) {
      try {
        if (userInfo.password) {
          await updatePassword(auth.currentUser, userInfo.password);
          console.log("Password updated successfully.");
        }

        const userDocRef = doc(db, "User", auth.currentUser.uid);
        await setDoc(userDocRef, {
          username: userInfo.username,
          phone: userInfo.phone,
          address: userInfo.address,
          postalCode: userInfo.postalCode,
          email: userInfo.email,
        }, { merge: true });

        console.log("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("There was an issue updating your profile. Please try again.");
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "Product", productId));
      setUserProducts(userProducts.filter(product => product.id !== productId));
      console.log("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    try {
      const productRef = doc(db, "Product", editingProductId);
      await updateDoc(productRef, editedProduct);
      setUserProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProductId ? { ...product, ...editedProduct } : product
        )
      );
      setEditingProductId(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <PageHeader />
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center align-items-center">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '220px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage 
                    src="userphoto.jpeg"
                    alt="User Profile"
                    className="mt-4 mb-2 img-thumbnail"
                    fluid
                    style={{ width: '150px', zIndex: '1' }}
                  />
                  <MDBBtn outline color="dark" style={{ height: '36px' }} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </MDBBtn>
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{userInfo.username || "Loading..."}</MDBTypography>
                  <MDBCardText>{userInfo.address || "Loading..."}</MDBCardText>
                </div>
              </div>
              <MDBCardBody className="text-black p-5" style={{ backgroundColor: '#f1f2f6' }}>
                <p className="lead fw-normal mb-4">My Profile:</p>
                <div className="p-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <MDBInput className="mb-3" label="User Name" name="username" value={userInfo.username} onChange={handleChange} />
                      <MDBInput className="mb-3" label="Phone Number" name="phone" value={userInfo.phone} onChange={handleChange} />
                      <MDBInput className="mb-3" label="Address" name="address" value={userInfo.address} onChange={handleChange} />
                      <MDBInput className="mb-3" label="Postal Code" name="postalCode" value={userInfo.postalCode} onChange={handleChange} />
                      <MDBInput className="mb-3" label="Email" name="email" type="email" value={userInfo.email} onChange={handleChange} />
                      <MDBInput className="mb-3" label="Password" name="password" type="password" value={userInfo.password} onChange={handleChange} />
                      <MDBBtn type="submit" color="primary">Save Changes</MDBBtn>
                    </form>
                  ) : (
                    <>
                      <MDBCardText className="font-italic mb-1"><strong>Username:</strong> {userInfo.username}</MDBCardText>
                      <MDBCardText className="font-italic mb-1"><strong>Phone Number:</strong> {userInfo.phone}</MDBCardText>
                      <MDBCardText className="font-italic mb-1"><strong>Address:</strong> {userInfo.address}</MDBCardText>
                      <MDBCardText className="font-italic mb-1"><strong>Postal Code:</strong> {userInfo.postalCode}</MDBCardText>
                      <MDBCardText className="font-italic mb-1"><strong>Email:</strong> {userInfo.email}</MDBCardText>
                      <MDBCardText className="font-italic mb-1"><strong>Password:</strong> *********</MDBCardText>
                    </>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>

            <div className="my-5">
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#333' }}>My Products</h3>
              <MDBRow>
                {userProducts.map((product) => (
                  <MDBCol md="4" key={product.id} className="mb-4">
                    <MDBCard>
                    
                    <div style={{ position: "relative" }}>
                    <MDBCardImage
                      src={product.image || "/placeholder-image.jpg"}
                      alt="Product"
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <MDBIcon
                      fas
                      icon="pen"
                      size="lg"
                      className="text-gray"
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        cursor: "pointer",
                        zIndex: "2",
                      }}
                      onClick={() => handleEditProduct(product)}
                    />
                    <MDBIcon
                      fas
                      icon="trash"
                      size="lg"
                      className="text-gray"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        zIndex: "2",
                      }}
                      onClick={() => handleDeleteProduct(product.id)}
                    />
                  </div>

                    
                    <MDBCardBody>
                      {editingProductId === product.id ? (
                        <>
                         
                          <MDBInput
                            className="mb-2"
                            label="Title"
                            name="Product_name"
                            value={editedProduct.Product_name}
                            onChange={handleChange}
                            
                          />
                          <MDBInput
                            className="mb-2"
                            label="Description"
                            name="description"
                            value={editedProduct.description}
                            onChange={handleChange}
                          />
                          <MDBInput
                            className="mb-2"
                            label="Price"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleChange}
                          />
                          <MDBBtn color="success" onClick={handleSaveProduct}>
                            Save
                          </MDBBtn>
                          <MDBBtn color="danger" onClick={() => setEditingProductId(null)}>
                            Cancel
                          </MDBBtn>
                        </>
                      ) : (
                        <>
                          <MDBTypography tag="h5">{product.Product_name}</MDBTypography>
                          <MDBCardText>{product.description}</MDBCardText>
                          <MDBCardText><strong>Price:</strong> {product.price}DT</MDBCardText>
                         
                        </>
                      )}
                    </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </div>
  );
}

export default Update;
