import React, { createContext, useContext, useState } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Create a custom hook to use the Cart Context
export const useCart = () => {
    return useContext(CartContext);
};

// Create a Cart Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Initialize cart items
    const [cartCount, setCartCount] = useState(0); // State for the cart count

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Check if product already exists in the cart
            const existingProductIndex = prevItems.findIndex(item => item.title === product.title);

            if (existingProductIndex !== -1) {
                // If product exists, update quantity
                const updatedItems = [...prevItems];
                updatedItems[existingProductIndex].quantity += 1;
                return updatedItems;
            } else {
                // If product doesn't exist, add it to the cart with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        setCartCount(prevCount => prevCount + 1); // Update cart count
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
