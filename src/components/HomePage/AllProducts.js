import React, { useState, useEffect } from "react";
import "./cards.css";
import { useCart } from "../CartContext/CartContext";
import { auth, db } from "../../firebase.config.mjs";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import Barrederecherche from "../Barrederecherche/Barrederecherche";

const AllProducts = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [metaKeywords, setMetaKeywords] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: [0, 500], // Default price range
  });
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRef = collection(db, "Product");
        const querySnapshot = await getDocs(productRef);
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const prices = productsList.map((product) => parseFloat(product.price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Extract product names for meta keywords
        const productNames = productsList.map((product) => product.Product_name).join(", ");
        setMetaKeywords(productNames);

        setAllProducts(productsList);
        setDisplayedProducts(productsList);
        setSelectedFilters((prev) => ({
          ...prev,
          price: [minPrice, maxPrice],
        }));
      } catch (error) {
        console.error("Error fetching products from Firestore:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All" || !selectedCategory) {
      setDisplayedProducts(allProducts);
    } else {
      setDisplayedProducts(
        allProducts.filter((product) => product.category === selectedCategory)
      );
    }
  }, [selectedCategory, allProducts]);

  const applyFilters = (filters) => {
    const filtered = allProducts.filter((product) => {
      const inCategory =
        filters.category.length === 0 || filters.category.includes(product.category);
      const inPriceRange =
        parseFloat(product.price) >= filters.price[0] &&
        parseFloat(product.price) <= filters.price[1];
      return inCategory && inPriceRange;
    });
    setDisplayedProducts(filtered);
  };

  const resetProducts = () => {
    setDisplayedProducts(allProducts);
    setSelectedFilters({
      category: [],
      price: [
        Math.min(...allProducts.map((p) => parseFloat(p.price))),
        Math.max(...allProducts.map((p) => parseFloat(p.price))),
      ],
    });
  };

  const handleAddToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    addToCart(product);

    const cartRef = doc(db, "Panier", user.uid);

    try {
      const productDoc = doc(db, "Product", product.id);
      const productSnap = await getDoc(productDoc);
      const productData = productSnap.data();
      const productOwner = productData?.userID;

      const cartSnap = await getDoc(cartRef);
      const cartData = cartSnap.data();
      const currentItems = cartData?.items || [];
      const currentNbrofLines = cartData?.nbroflines || 0;

      const existingProductIndex = currentItems.findIndex(
        (item) => item.Product_name === product.Product_name
      );

      let updatedItems;

      if (existingProductIndex !== -1) {
        updatedItems = currentItems.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...currentItems,
          {
            Product_name: product.Product_name,
            price: product.price,
            image: product.image,
            quantity: 1,
            description: product.description,
            owner: productOwner,
          },
        ];
      }

      await updateDoc(cartRef, {
        items: updatedItems,
        nbroflines: currentNbrofLines + 1,
      });
      console.log("Product added to cart successfully.");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };
  
  const handleLearnMore = (product) => {
    const slug = generateSlug(product.Product_name);
    navigate(`/product/${slug}`, { state: { product } });

  return (
    <div>
      <Helmet>
        <title>{`El Hanout - ${selectedCategory || "All Products"}`}</title>
        <meta
          name="description"
          content={`Explore and shop the best ${selectedCategory || "products"} at El Hanout.`}
        />
        <meta name="keywords" content={metaKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://el-hanout-57170.web.app/home/${selectedCategory}`} />
      </Helmet>
      <div style={{ marginLeft: "31.5%" }}>
        <Barrederecherche />
      </div>
      <div style={{ display: "flex" }}>
        <Sidebar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleApplyFilters={applyFilters}
          resetProducts={resetProducts}
        />
        <section
          className="py-12 sm:py-16 lg:py-20"
          style={{ backgroundColor: "#f1f2f6", flex: 1 }}
        >
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
              {displayedProducts.length === 0 ? (
                <div className="col-span-4 text-center text-xl text-gray-600">
                  No products found.
                </div>
              ) : (
                displayedProducts.map((product, index) => (
                  <div
                    key={index}
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
                        {product.price} DT
                      </p>
                      <div className="button-container flex flex-col items-end">
                        <button
                          className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <span
                          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                          onClick={() => handleLearnMore(product)}
                          style={{ cursor: "pointer" }}
                        >
                          Learn More
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
}

export default AllProducts;