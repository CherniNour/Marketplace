import React, { useState } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import Barrederecherche from "../Barrederecherche/Barrederecherche";
import { useCart } from '../CartContext/CartContext'; // Import the Cart context
import './pageheader.css';

function PageHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { cartCount } = useCart(); // Use cart context to get the count

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = () => {
        navigate("/change info");
    };

    const handleCartClick = () => {
        navigate("/Your cart");
    };

    const handleLogout = () => {
        navigate("/login");
    };
    const handleAddProductClick = () => {
        navigate("/Add your product");
    };

    return (
        <div className="container-fluid px-4 py-5 my-5 text-center position-relative">
            {/* Logo à gauche et titre centré */}
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
                    {/* User Avatar, Name, and Cart */}
                    <div className="d-flex align-items-center mb-3" style={{ fontSize: '1.1em' }}>
                        <IconButton onClick={handleAvatarClick} style={{ transform: 'scale(1.2)' }}>
                            <Avatar alt="Nom d'utilisateur" src="/path/to/avatar.jpg" style={{ width: 40, height: 40 }}>W</Avatar>
                        </IconButton>
                        <Typography variant="body1" style={{ marginLeft: '10px', fontSize: '1.1em' }}>Wassim jha</Typography>
                        <IconButton onClick={handleCartClick} aria-label="Shopping Cart" style={{ marginLeft: '16px', transform: 'scale(1.2)' }}>
                            <ShoppingCartIcon />
                            <span className="cart-item-count" style={{ fontSize: '0.9em' }}>{cartCount}</span> {/* Display cart count */}
                        </IconButton>
                    </div>

                    {/* Search Bar */}
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
              backgroundColor: '#4CAF50', // Green color for visibility
              color: '#FFFFFF'
            }}
          >
            Add Product
          </Button>
                </div>
            </div>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleChange}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleChange}>Change user info</MenuItem>
                <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Log out</MenuItem>
            </Menu>
        </div>
    );
}

export default PageHeader;
