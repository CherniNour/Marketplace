import React from 'react';
import { useCart } from '../CartContext/CartContext';
function SportsandOutdoors() {
  const { addToCart } = useCart(); // Use the addToCart function from the Cart context

  const handleAddToCart = () => {
      addToCart(); // Call the addToCart function to increment the cart count
  };

  return (
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#f1f2f6' }}>
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
              <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
                  {[
                      {
                          image: "jblflip.jpg",
                          title: "JBL flip 5 Portable Bluetooth Speaker",
                          price: "499.00DT"
                      },
                      {
                          image: "./applewatch.jpg",
                          title: "Apple Smart Watch 6 - Special Edition",
                          price: "1300.00DT"
                      },
                      {
                        image: "casquejbl.jpg",
                        title: "Casque JBL Tune T510 Bluetooth",
                        price: "195.00DT"
                      },
                      {
                        image: "./airpodspro2.jpg",
                        title: "Air pods Pro 2 Apple type-C",
                        price: "700.00DT"
                      },
                      {
                          image: "./iphone15.png",
                          title: "Iphone 15 PRO MAX 256GB",
                          price: "4800.00DT"
                      },
                      {
                          image: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png",
                          title: "Beylob 90 Speaker",
                          price: "230.00DT"
                      },
                  ].map((product, index) => (
                      <div key={index} className="product-card relative p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                          <a href="#" title={product.title}>
                              <div className="overflow-hidden rounded-md">
                                  <img
                                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                      src={product.image}
                                      alt={product.title}
                                  />
                              </div>
                          </a>
                          <div className="flex flex-col items-start mt-4 space-y-2">
                              <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                                  {product.title}
                              </h3>
                              <p className="product-price text-sm font-bold text-gray-900 sm:text-base">{product.price}</p>
                              <div className="button-container flex flex-col items-end">
                                  <button 
                                      className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                                      onClick={handleAddToCart} // Attach the function here
                                  >
                                      Add to Cart
                                  </button>
                                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Learn More</a>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );
};
export default SportsandOutdoors;
