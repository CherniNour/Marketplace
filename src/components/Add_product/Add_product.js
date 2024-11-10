import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Add_product() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Product_name: '',
    product_image: null,
    price: '',
    description: '',
    category: '',
  });

  const { Product_name, product_image, price, description, category } = formData;
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Ajoutez la logique de sauvegarde du produit ici

    setLoading(false);
    navigate('/products');
  };

  const onMutate = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        product_image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const validatePrice = (value) => {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue > 0; // Vérifie que c'est un nombre et qu'il est positif
  };

  return (
    <div>
      {/* Header */}
      <PageHeader />

      <div className='container mt-5'>
        <header>
          <h2 className='text-center mb-4'> 
            
          </h2>
        </header>

        <main>
          <form onSubmit={onSubmit} className='bg-light p-4 rounded'>
            <div className='mb-3'>
              <label className='form-label'>Product Name</label>
              <input
                className='form-control'
                type='text'
                id='Product_name'
                value={Product_name}
                onChange={onMutate}
                maxLength='32'
                minLength='3'
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Product Image</label>
              <input
                className='form-control'
                type='file'
                id='product_image'
                onChange={onMutate}
                accept='.jpg,.png,.jpeg'
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Price</label>
              <input
                className='form-control'
                type='number'
                id='price'
                value={price}
                onChange={(e) => {
                  onMutate(e);
                  if (!validatePrice(e.target.value)) {
                    e.target.setCustomValidity('Please enter a positive number.'); // Message d'erreur personnalisé
                  } else {
                    e.target.setCustomValidity(''); // Réinitialise le message d'erreur
                  }
                }}
                min='0.01'
                step='0.01'
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Detailed Description</label>
              <textarea
                className='form-control'
                id='description'
                value={description}
                onChange={onMutate}
                maxLength='500'
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Category</label>
              <select
                className='form-select'
                id='category'
                value={category}
                onChange={onMutate}
                required
              >
                <option value=''>Select Category</option>
                <option value='electronics'>Electronics</option>
                <option value='clothing'>Clothing</option>
                <option value='Sports_Outdoors'>Sports_Outdoors</option>
              </select>
            </div>

            <button type='submit' className='btn btn-primary w-100'>
              Add Product
            </button>
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Add_product;
