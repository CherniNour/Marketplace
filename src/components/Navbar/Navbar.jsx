import React, { useState, useEffect } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import Electronics from '../HomePage/Electronics';
import Clothing from '../HomePage/Clothing';
import SportsandOutdoors from '../HomePage/SportsandOutdoors';
import AllProducts from '../HomePage/AllProducts';
import { db } from '../../firebase.config'; // Assurez-vous que le chemin vers votre configuration Firebase est correct
import { collection, getDocs } from 'firebase/firestore';

export default function App() {
  const [basicActive, setBasicActive] = useState('All');
  const [categories, setCategories] = useState([
    { name: 'All', component: <AllProducts /> },
    { name: 'Electronics', component: <Electronics /> },
    { name: 'Clothing', component: <Clothing /> },
    { name: 'Sports & Outdoors', component: <SportsandOutdoors /> }
  ]);

  // Fetch categories dynamically from Firebase
  useEffect(() => {
    let isMounted = true; // Prévenir les mises à jour d'état sur un composant démonté

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'Categories');
        const categorySnapshot = await getDocs(categoriesCollection);

        const dynamicCategories = categorySnapshot.docs.map(doc => ({
          name: doc.data().name.trim(), // Normalisation des noms
          component: <div>{doc.data().name} Products Placeholder</div> // Remplacez par des composants dynamiques si nécessaire
        }));

        if (isMounted) {
          setCategories(prevCategories => {
            // Combine les catégories initiales et dynamiques sans doublons
            const allCategories = [...prevCategories, ...dynamicCategories];
            const uniqueCategories = allCategories.filter(
              (category, index, self) =>
                index === self.findIndex(
                  c => c.name.toLowerCase() === category.name.toLowerCase() // Comparaison insensible à la casse
                )
            );
            return uniqueCategories;
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // Nettoyage pour éviter des erreurs liées au cycle de vie
    };
  }, []); // Dépendance vide pour exécuter une seule fois

  // Gérer le clic sur les onglets
  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };

  return (
    <>
      <div className="d-flex justify-content-center mb-4">
        <MDBTabs pills className="custom-tabs">
          {categories.map((category) => (
            <MDBTabsItem key={category.name}>
              <MDBTabsLink
                onClick={() => handleBasicClick(category.name)}
                active={basicActive === category.name}
                className={`custom-tab-link ${basicActive === category.name ? 'active-tab' : ''}`}
              >
                {category.name}
              </MDBTabsLink>
            </MDBTabsItem>
          ))}
        </MDBTabs>
      </div>

      <MDBTabsContent>
        {categories.map((category) => (
          <MDBTabsPane open={basicActive === category.name} key={category.name}>
            {category.component}
          </MDBTabsPane>
        ))}
      </MDBTabsContent>

      <style jsx>{`
        .custom-tabs {
          font-family: 'Poppins', sans-serif; /* Police moderne unique */
          font-size: 18px;
          gap: 15px; /* Espacement entre les onglets */
        }

        .custom-tab-link {
          padding: 12px 24px; /* Rendre les onglets plus spacieux */
          border-radius: 20px; /* Onglets arrondis */
          color: #333; /* Couleur du texte neutre */
          text-transform: uppercase;
          font-weight: 500;
          transition: all 0.3s ease; /* Effet de transition fluide */
        }

        .active-tab {
          color: #fff; /* Texte blanc pour l'onglet actif */
          background: #36D7B7; /* Couleur unique pour l'onglet actif */
          font-weight: 700; /* Texte en gras pour l'onglet actif */
        }
      `}</style>
    </>
  );
}
