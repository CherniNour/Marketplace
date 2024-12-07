import React, { useState, useEffect } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory'; // Icône des commandes
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import { auth, db } from '../../firebase.config.mjs';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './pageheader.css';

function PageHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { cartCount, setCartCount } = useCart();

    const [userName, setUserName] = useState('');
    const [initials, setInitials] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "User", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserName(data.username || 'User');
                    setInitials(data.username ? data.username[0].toUpperCase() : '');

                    if (data.role === 'admin') {
                        setIsAdmin(true);
                    }
                }

                // Récupération du nombre d'articles dans le panier
                const cartDoc = await getDoc(doc(db, "Panier", user.uid));
                if (cartDoc.exists()) {
                    const cartData = cartDoc.data();
                    setCartCount(cartData.nbroflines || 0);
                }
            } else {
                // Réinitialisation si aucun utilisateur n'est connecté
                setUserName('');
                setInitials('');
                setIsAdmin(false);
                setCartCount(0);
            }
            setIsLoading(false); // Terminer le chargement après la vérification
        });

        return () => unsubscribe(); // Nettoyage lors du démontage du composant
    }, [setCartCount]);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = () => {
        navigate("/My profile");
    };

    const handleCartClick = () => {
        navigate("/Your cart");
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Déconnexion de l'utilisateur
            navigate("/login", { replace: true }); // Rediriger vers la page de connexion et remplacer l'historique
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const handleAddProductClick = () => {
        navigate("/Add your product");
    };

    const handleAdminPageClick = () => {
        navigate("/admin");
    };

    const handleLogoClick = () => {
        navigate("/home");
    };

    return (
        <div>
            {/* Fixed Navbar Section */}
            <div
                className="d-flex justify-content-center align-items-center p-3"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    padding: '10px 20px',
                }}
            >
                <div className="position-absolute start-0 d-flex flex-column align-items-start">
                    <img
                        src="my-icon.ico"
                        alt="El Hanout Logo"
                        className="logo"
                        style={{
                            width: '150px',
                            height: '150px',
                            cursor: 'pointer',
                            marginLeft: '5%',
                            marginTop: '0',
                        }}
                        onClick={handleLogoClick}
                    />
                </div>
                <div className="flex-grow-1 text-center">
                    <h2 className="fw-bold" style={{ fontSize: '2.4em', marginLeft: '23%' }}>
                        El Hanout <span className="text-primary">Marketplace</span>
                    </h2>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="d-flex align-items-center mb-3" style={{ fontSize: '1.1em', marginTop: '12px' }}>
                        <IconButton onClick={handleAvatarClick} style={{ transform: 'scale(1.2)' }}>
                            <Avatar alt={userName} style={{ width: 40, height: 40 }}>
                                {!isLoading ? initials : ''}
                            </Avatar>
                        </IconButton>
                        <Typography variant="body1" style={{ marginLeft: '10px', fontSize: '1.1em' }}>
                            {!isLoading ? userName : 'Loading...'}
                        </Typography>
                        <IconButton
                            onClick={() => navigate('/My-orders')}
                            aria-label="Orders"
                            style={{ marginLeft: '16px', transform: 'scale(1.2)' }}
                        >
                            <InventoryIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleAddProductClick}
                            aria-label="Add Product"
                            style={{ marginLeft: '16px', transform: 'scale(1.2)', color: '#4CAF50' }}
                        >
                            <AddCircleIcon />
                        </IconButton>
                        {isAdmin && (
                            <IconButton
                                onClick={handleAdminPageClick}
                                aria-label="Admin Page"
                                style={{ marginLeft: '16px', transform: 'scale(1.2)', color: '#FF5722' }}
                            >
                                <AdminPanelSettingsIcon />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={handleCartClick}
                            aria-label="Shopping Cart"
                            style={{ marginLeft: '16px', transform: 'scale(1.2)' }}
                        >
                            <ShoppingCartIcon />
                            <span className="cart-item-count" style={{ fontSize: '0.9em' }}>
                                {cartCount}
                            </span>
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div
                className="container-fluid px-4 py-5 my-5 text-center position-relative"
                style={{ marginTop: '80px' }} // Prevent overlap with the fixed navbar
            >
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleChange}>My profile</MenuItem>
                    <MenuItem onClick={handleLogout} style={{ color: 'red' }}>
                        Log out
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export default PageHeader;
