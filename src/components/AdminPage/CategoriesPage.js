import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config.mjs';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import PacmanLoader from 'react-spinners/PacmanLoader';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'Categories');
        const categorySnapshot = await getDocs(categoriesCollection);

        const fetchedCategories = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Error loading data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName) {
      alert("Category name is required.");
      return;
    }

    setAddLoading(true);
    try {
      const categoriesCollectionRef = collection(db, 'Categories');
      const newCategory = {
        name: newCategoryName,
        description: newCategoryDescription || '',
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(categoriesCollectionRef, newCategory);

      setSuccess(true);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setCategories([...categories, { id: docRef.id, ...newCategory }]);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Error adding category.");
    } finally {
      setAddLoading(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const categoryDocRef = doc(db, 'Categories', id);
      await deleteDoc(categoryDocRef);

      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Error deleting category. Please try again.");
    }
  };

  // Loading spinner when data is fetching
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PacmanLoader color="#36D7B7" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div>
      <h2>Category List</h2>

      {/* Display categories table */}
      <table className="table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || 'No description'}</td>
                <td>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add category form */}
      <h3>Add a New Category</h3>
      <form onSubmit={handleAddCategory}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            className="form-control"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryDescription">Description (optional)</label>
          <textarea
            id="categoryDescription"
            className="form-control"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={addLoading}>
          {addLoading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {success && <p className="text-success">Category added successfully!</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default CategoriesPage;
