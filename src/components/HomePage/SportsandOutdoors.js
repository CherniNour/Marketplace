import React, { useState, useEffect } from 'react';
import './cards.css';
import { useCart } from '../CartContext/CartContext';
import { auth, db } from '../../firebase.config';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Add missing imports

const SportsandOutdoors = () => {
    const { addToCart } = useCart(); // Use the addToCart function from the Cart context
    const [products, setProducts] = useState([]); // State to store products fetched from Firestore

    // Fetch sports and outdoors products from Firestore on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productRef = collection(db, "Product");
                // Query Firestore for products where category is 'sports_outdoors'
                const q = query(productRef, where("category", "==", "Sports_Outdoors"));
                const querySnapshot = await getDocs(q);
                const productsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productsList); // Set the fetched products to state
            } catch (error) {
                console.error("Error fetching products from Firestore:", error);
            }
        };

        fetchProducts(); // Call the function to fetch products
    }, []); // Empty dependency array to run only once on component mount

    const handleAddToCart = async (product) => {
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }

        // Call addToCart to update the cart visually
        addToCart(product); // Pass the product data to addToCart

        // Define the user's cart in Firebase (using their user ID)
        const cartRef = doc(db, "Panier", user.uid);

        try {
            // Get the product owner from the Product collection
            const productDoc = doc(db, "Product", product.id);
            const productSnap = await getDoc(productDoc);
            const productData = productSnap.data();
            const productOwner = productData?.userID; // Fetch the userId of the product owner

            // Get the current cart items and nbroflines count
            const cartSnap = await getDoc(cartRef);
            const cartData = cartSnap.data();
            const currentItems = cartData?.items || [];
            const currentNbrofLines = cartData?.nbroflines || 0;

            // Check if the product already exists in the cart
            const existingProductIndex = currentItems.findIndex(item => item.Product_name === product.Product_name);

            let updatedItems;

            if (existingProductIndex !== -1) {
                // If product already exists, increment the quantity
                updatedItems = currentItems.map((item, index) => 
                    index === existingProductIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // If product does not exist, add it with quantity 1
                updatedItems = [
                    ...currentItems,
                    { 
                        Product_name: product.Product_name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                        description: product.description,
                        owner: productOwner // Store the original owner from the Product collection
                    }
                ];
            }
    
            // Update the user's cart in Firestore and increment nbroflines
            await updateDoc(cartRef, { 
                items: updatedItems, 
                nbroflines: currentNbrofLines + 1 // Increment nbroflines by 1
            });
            console.log("Product added to cart successfully.");
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#f1f2f6' }}>
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
                    {products.length === 0 ? (
                        <div className="col-span-4 text-center text-xl text-gray-600">Loading products...</div>
                    ) : (
                        products.map((product, index) => (
                            <div key={index} className="product-card relative p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                                <a href="#" title={product.Product_name}>
                                    <div className="overflow-hidden rounded-md">
                                        <img
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            src={product.image}
                                            alt={product.Product_name}
                                            style={{ width: '500px', height: '450px' }}
                                        />
                                    </div>
                                </a>
                                <div className="flex flex-col items-start mt-4 space-y-2">
                                    <h3 className="text-base font-bold text-gray-900 sm:text-lg mt-2">
                                        {product.Product_name}
                                    </h3>
                                    <p className="product-price text-sm font-bold text-gray-900 sm:text-base">{product.price}</p>
                                    <div className="button-container flex flex-col items-end">
                                        <button 
                                            className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                                            onClick={() => handleAddToCart(product)} // Pass product data to handleAddToCart
                                        >
                                            Add to Cart
                                        </button>
                                        <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default SportsandOutdoors;
