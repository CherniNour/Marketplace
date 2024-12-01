import React, { useState, useEffect } from 'react';
import PageHeader from '../PageHeader/PageHeader';
import Footer from '../Footer/Footer';
import { db } from '../../firebase.config'; // Assurez-vous d'importer la config Firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import des fonctions Firestore
import { useNavigate } from 'react-router-dom';

export default function Research() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]); // État pour stocker les produits trouvés
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [noResults, setNoResults] = useState(false); // Indicateur de résultats vides   
  const navigate = useNavigate();

  const handleLearnMore = (product) => {
    // Passing product data using the state prop of navigate
    navigate('/Product-Details', { state: { product } });
  };

  useEffect(() => {
    const query = sessionStorage.getItem('searchQuery');
    if (query) {
      setSearchQuery(query); // Récupérer la recherche de sessionStorage
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchProducts = async () => {
        try {
          const productRef = collection(db, 'Product');
          const q = query(productRef, where('Product_name', '>=', searchQuery), where('Product_name', '<=', searchQuery + '\uf8ff'));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            setNoResults(true); // Si aucun produit trouvé
          } else {
            const productsList = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProducts(productsList); // Mettre à jour les produits trouvés
            setNoResults(false); // Réinitialiser l'indicateur de résultats vides
          }
        } catch (error) {
          console.error('Error fetching products from Firestore:', error);
        } finally {
          setLoading(false); // Terminer le chargement
        }
      };

      fetchProducts(); // Appeler la fonction de récupération des produits
    }
  }, [searchQuery]); // Recharger lorsque la recherche change

  return (
    <div>
      <PageHeader />
      {loading && (
        <div className="text-center text-gray-500 text-lg my-4">
          Loading products...
        </div>
      )}
  
      {!loading && searchQuery && (
        <div className="text-center my-4">
          <div className="text-2xl font-bold text-gray-900">
            <span
              style={{
                background: "linear-gradient(90deg, #4A90E2, #50E3C2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize:"30px",
              }}
            >
              <i className="fas fa-search mr-4"></i>
                 Results for: "{searchQuery}"
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {products.length > 0
              ? `${products.length} product(s) found`
              : "Try refining your search keywords."}
          </p>
          <hr className="border-t border-gray-300 mt-4" />
        </div>
      )}
  
      {noResults ? (
        <div className="text-center text-red-600 text-xl my-8">
          <div className="flex flex-col items-center">
            <i className="fas fa-search-minus text-6xl mb-4"></i>
            No products found for "<span className="font-bold">{searchQuery}</span>"
          </div>
          <p className="text-gray-600 mt-2">
            Try adjusting your search or browsing other categories.
          </p>
        </div>
      ) : (
        <section
          className="py-12 sm:py-16 lg:py-20"
          style={{ backgroundColor: "#f1f2f6" }}
        >
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card relative p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <a href="" title={product.Product_name}>
                      <div className="overflow-hidden rounded-md">
                        <img
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          src={product.image}
                          alt={product.Product_name}
                          style={{ width: "500px", height: "450px" }}
                          onClick={() => handleLearnMore(product)}
                        />
                      </div>
                    </a>
                    <div className="flex flex-col items-start mt-4 space-y-2">
                      <h3 className="text-base font-bold text-gray-900 sm:text-lg mt-2">
                        {product.Product_name}
                      </h3>
                      <p className="product-price text-sm font-bold text-gray-900 sm:text-base">
                        {product.price}DT
                      </p>
                      <div className="button-container flex flex-col items-end">
                        <button className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition">
                          Add to Cart
                        </button>
                        <span
                          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                          onClick={() => handleLearnMore(product)}
                        >
                          Learn More
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products match your search.</p>
              )}
            </div>
          </div>
        </section>
      )}
  
      <Footer />
    </div>
  );
}  