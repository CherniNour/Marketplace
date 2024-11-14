import React, { useState, useEffect } from 'react';
import { PacmanLoader } from 'react-spinners';

function Pacman() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulation du chargement - ici vous pouvez ajouter la logique
        // de fin de chargement par exemple après l'arrivée des données de l'API.
        const timer = setTimeout(() => setLoading(false), 3000); // Changez 3000 par la durée réelle
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <PacmanLoader color="#36D7B7" loading={loading} size={50} />
        </div>
    );
}

export default Pacman;