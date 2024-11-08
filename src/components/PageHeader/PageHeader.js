import React, { useState, useEffect } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import Barrederecherche from "../Barrederecherche/Barrederecherche";
import { useCart } from '../CartContext/CartContext';
import { auth, db } from '../../firebase.config';
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
        navigate("/change info");
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

    return (
        <div className="container-fluid px-4 py-5 my-5 text-center position-relative">
            <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                <div className="position-absolute start-0">
                    <img src='my-icon.ico' alt="El Hanout Logo" className="logo" style={{ width: '300px', height: '300px' }} />
                </div>

                <div className="flex-grow-1">
                    <h2 className="display-2 fw-bold text-center">
                        El Hanout <span className="text-primary">Marketplace</span>
                    </h2>
                </div>
            </div>

            <div className="d-flex justify-content-end align-items-start p-3" style={{ position: 'fixed', top: '40px', right: '20px', zIndex: 1000 }}>
                <div className="d-flex flex-column align-items-end">
                    <div className="d-flex align-items-center mb-3" style={{ fontSize: '1.1em' }}>
                        <IconButton onClick={handleAvatarClick} style={{ transform: 'scale(1.2)' }}>
                            <Avatar alt={userName} style={{ width: 40, height: 40 }}>
                                {!isLoading ? initials : ''}
                            </Avatar>
                        </IconButton>
                        <Typography variant="body1" style={{ marginLeft: '10px', fontSize: '1.1em' }}>
                            {!isLoading ? userName : 'Loading...'}
                        </Typography>
                        <IconButton onClick={handleCartClick} aria-label="Shopping Cart" style={{ marginLeft: '16px', transform: 'scale(1.2)' }}>
                            <ShoppingCartIcon />
                            <span className="cart-item-count" style={{ fontSize: '0.9em' }}>{cartCount}</span>
                        </IconButton>
                    </div>

                    <div className="search-bar-container" style={{ width: '100%', maxWidth: '320px' }}>
                        <Barrederecherche />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddProductClick}
                        style={{
                            marginTop: '15px',
                            fontSize: '1.1em',
                            fontWeight: 'bold',
                            padding: '12px 24px',
                            backgroundColor: '#4CAF50',
                            color: '#FFFFFF'
                        }}
                    >
                        Add Product
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleAdminPageClick}
                            style={{
                                marginTop: '10px',
                                fontSize: '1.1em',
                                fontWeight: 'bold',
                                padding: '12px 24px',
                                backgroundColor: '#FF5722',
                                color: '#FFFFFF'
                            }}
                        >
                            Admin Page
                        </Button>
                    )}
                </div>
            </div>

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
                <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Log out</MenuItem>
            </Menu>
        </div>
    );
}

export default PageHeader;
