import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';  // Importation du fichier CSS global pour la responsivité
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignupForm/SignupForm';
import HomePage from './components/HomePage/HomePage';
import WelcomePage from './components/WelcomePage/WelcomePage';
import Cart from './components/Cart/Cart';
import Update from './components/Update/Update';
import { CartProvider } from './components/CartContext/CartContext';
import Add_product from './components/Add_product/Add_product';
import AdminPage from './components/AdminPage/AdminPage';
import PacmanLoader from './components/PacmanLoader/PacmanLoader';
import Research from './components/Research/Research';
import OrdersList from './components/Order_tracking/Order_list';
import Confirm_order from './components/Order_summary/Order_summary';
import Product from './components/HomePage/ProductDetails';
import './i18n'; // Assurez-vous que le chemin est correct


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Arrêter le loader après un délai de 3 secondes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // [] indique que cet effet s'exécute seulement lors du premier rendu

  return (
    <CartProvider>
      <Router> {/* Enveloppez le contenu dans <Router> */}
        <div>
          {loading ? (
            <PacmanLoader /> // Affiche le loader si loading est vrai
          ) : (
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/Change info" element={<Update />} />
              <Route path="/Your cart" element={<Cart />} />
              <Route path="/Add your product" element={<Add_product />} />       
              <Route path="/Admin" element={<AdminPage />} />
              <Route path="/My-orders" element={<OrdersList />} />
              <Route path="/PacmanLoader" element={<PacmanLoader />} />
              <Route path="/ProductResearch" element={<Research />} />
              <Route path="/order-summary" element={<Confirm_order />} />
              <Route path="/Product-Details" element={<Product />} />
            </Routes>
          )}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
