import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm'; // Adjust the import path as necessary
import SignUpForm from './components/SignupForm/SignupForm'; // Adjust the import path as necessary
import HomePage from './components/HomePage/HomePage'; // Your homepage component
import WelcomePage from './components/WelcomePage/WelcomePage';
import Cart from './components/Cart/Cart';
import Update from './components/Update/Update';
import { CartProvider } from './components/CartContext/CartContext'; // Import the CartProvider
import Add_product from './components/Add_product/Add_product';
import AdminPage from './components/AdminPage/AdminPage';

function App() {
  return (
    <CartProvider> {/* Wrap the Router with CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/Change info" element={<Update />} />
          <Route path="/Your cart" element={<Cart />} />
          <Route path="/Add your product" element={<Add_product />} />
          <Route path="/Admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
