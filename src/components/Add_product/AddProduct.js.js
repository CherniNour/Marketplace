import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase.config'; // Import auth and db from Firebase config
import PageHeader from '../PageHeader/PageHeader';
import Footer from "../Footer/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

function Add_product() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Product_name: '',
    product_image: null,
    price: '',
    description: '',
    category: '',
  });
  const [categories, setCategories] = useState([]); // State for categories
  const [showAlert, setShowAlert] = useState(false); // State for the alert visibility
  const [categoriesLoading, setCategoriesLoading] = useState(true); // State for loading categories

  const { Product_name, product_image, price, description, category } = formData;
  const navigate = useNavigate();

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'Categories');
        const categorySnapshot = await getDocs(categoriesCollection);

        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(categoryList); // Use only fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userID = auth.currentUser?.uid;

      if (!userID) {
        console.error('User is not authenticated');
        setLoading(false);
        return;
      }

      const productRef = collection(db, 'Product');

      let imageBase64 = '';
      if (product_image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageBase64 = reader.result;

          await addDoc(productRef, {
            Product_name,
            price,
            description,
            category,
            image: imageBase64,
            userID,
          });

          console.log('Product added to Firestore');
          setLoading(false);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            navigate('/home');
          }, 3000);
        };
        reader.onerror = (error) => {
          console.error('Error reading image file', error);
          setLoading(false);
        };
        reader.readAsDataURL(product_image);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setLoading(false);
    }
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
    return !isNaN(numberValue) && numberValue > 0; // Check for a valid positive number
  };

  return (
    <div>
      {/* Header */}
      <PageHeader />

      <div className='container mt-5'>
        <header>
          <h2 className='text-center mb-4'>
            Add your product
          </h2>
        </header>

        {/* Custom Alert */}
        {showAlert && (
          <div className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert">
            <strong>Success!</strong> Your product has been added.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}></button>
          </div>
        )}

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
                    e.target.setCustomValidity('Please enter a positive number.');
                  } else {
                    e.target.setCustomValidity('');
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
              {categoriesLoading ? (
                <p>Loading categories...</p>
              ) : (
                <select
                  className='form-select'
                  id='category'
                  value={category}
                  onChange={onMutate}
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button type='submit' className='btn btn-primary w-100'>
              {loading ? 'Adding Product...' : 'Add Product'}
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
