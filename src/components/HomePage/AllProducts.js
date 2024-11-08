import React from 'react';
import './cards.css';
import { useCart } from '../CartContext/CartContext';
import { auth, db } from '../../firebase.config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const AllProducts = () => {
    const { addToCart } = useCart(); // Use the addToCart function from the Cart context

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
            // Get the current cart items and nbroflines count
            const cartSnap = await getDoc(cartRef);
            const cartData = cartSnap.data();
            const currentItems = cartData?.items || [];
            const currentNbrofLines = cartData?.nbroflines || 0;

            // Check if the product already exists in the cart
            const existingProductIndex = currentItems.findIndex(item => item.title === product.title);

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
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                        description: "Detailed description here" // Replace with actual description if available
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
                    {[
                        {
                            image: "jblflip.jpg",
                            title: "JBL flip 5 Portable Bluetooth Speaker",
                            price: "499.00DT"
                        },
                        {
                            image: "./applewatch.jpg",
                            title: "Apple Smart Watch 6 - Special Edition",
                            price: "1300.00DT"
                        },
                        {
                            image: "casquejbl.jpg",
                            title: "Casque JBL Tune T510 Bluetooth",
                            price: "195.00DT"
                        },
                        {
                            image: "./airpodspro2.jpg",
                            title: "Air pods Pro 2 Apple type-C",
                            price: "700.00DT"
                        },
                        {
                            image: "./iphone15.png",
                            title: "Iphone 15 PRO MAX 256GB",
                            price: "4800.00DT"
                        },
                        {
                            image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png",
                            title: "Beylob 90 Speaker",
                            price: "230.00DT"
                        },
                    ].map((product, index) => (
                        <div key={index} className="product-card relative p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                            <a href="#" title={product.title}>
                                <div className="overflow-hidden rounded-md">
                                    <img
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        src={product.image}
                                        alt={product.title}
                                    />
                                </div>
                            </a>
                            <div className="flex flex-col items-start mt-4 space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                                    {product.title}
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
