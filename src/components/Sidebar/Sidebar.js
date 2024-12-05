import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config"; // Adjust the import based on your structure

const Sidebar = ({
  selectedFilters,
  setSelectedFilters,
  handleApplyFilters,
  resetProducts,
}) => {
  const defaultFilters = {
    category: [],
    price: [0, 500], // Default range, updated dynamically
  };

  const [localFilters, setLocalFilters] = useState(
    selectedFilters || defaultFilters
  );
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    const fetchCategoriesAndPrice = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Product"));

        // Fetch categories and calculate price range
        const uniqueCategories = new Set();
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        querySnapshot.forEach((doc) => {
          const product = doc.data();
          if (product.category) {
            // Normalize category name to lowercase to avoid duplicates due to case differences
            uniqueCategories.add(product.category.toLowerCase());
          }
          if (product.price) {
            const price = parseFloat(product.price);
            if (!isNaN(price)) {
              minPrice = Math.min(minPrice, price);
              maxPrice = Math.max(maxPrice, price);
            }
          }
        });

        // Convert unique categories to an array and map back to original case
        const categoriesArray = Array.from(uniqueCategories);
        setCategories(categoriesArray);

        setPriceRange([minPrice, maxPrice]);
        setLocalFilters({
          ...localFilters,
          price: [minPrice, maxPrice],
        });
      } catch (error) {
        console.error("Error fetching categories or price range:", error);
      }
    };

    fetchCategoriesAndPrice();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    const isChecked = event.target.checked;
    const updatedCategories = isChecked
      ? [...localFilters.category, category]
      : localFilters.category.filter((cat) => cat !== category);

    setLocalFilters({ ...localFilters, category: updatedCategories });
  };

  const handlePriceChange = (event, newValue) => {
    setLocalFilters({ ...localFilters, price: newValue });
  };

  const applyFilters = () => {
    setSelectedFilters(localFilters);
    handleApplyFilters(localFilters);
  };

  const resetFilters = () => {
    setLocalFilters({
      category: [],
      price: priceRange,
    });
    setSelectedFilters({
      category: [],
      price: priceRange,
    });
    resetProducts(); // Reset products to show all
  };

  return (
    <Box
      sx={{
        bgcolor: "#F5F5F5",
        width: "250px",
        p: "24px",
        borderRight: "1px solid #ddd",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Category Filter */}
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom>
          Category
        </Typography>
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  name={category}
                  checked={localFilters.category.includes(category)}
                  onChange={handleCategoryChange}
                />
              }
              label={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Price Range Filter */}
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={localFilters.price}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={priceRange[0]}
          max={priceRange[1]}
        />
        <Typography>
          Price: {localFilters.price[0]} DT - {localFilters.price[1]} DT
        </Typography>
      </Box>

      {/* Buttons */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
