import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Popper, useAutocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { grey } from '@mui/material/colors';
import { db } from '../../firebase.config';
import { collection, query, getDocs } from 'firebase/firestore';
import { useForkRef } from '@mui/material/utils';
 
const CustomAutocomplete = React.forwardRef(function CustomAutocomplete(props, ref) {
  const { disableClearable = false, disabled = false, readOnly = false, ...other } = props;
  const navigate = useNavigate(); // Navigation for search
 
  const {
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
    dirty,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions,
    inputValue,
    setInputValue,
  } = useAutocomplete({
    ...props,
    componentName: 'BaseAutocomplete',
    openOnFocus: false,
  });
 
  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly;
  const rootRef = useForkRef(ref, setAnchorEl);
 
  const shouldShowSuggestions = inputValue.length > 0;
 
  // Function to handle search
  const handleSearch = () => {
    sessionStorage.setItem('searchQuery', inputValue); // Save query in sessionStorage
    navigate('/ProductResearch'); // Navigate to search results page
  };
 
  // Handle Enter key
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
 
  return (
    <React.Fragment>
      <StyledAutocompleteRoot {...getRootProps(other)} ref={rootRef} className={focused ? 'focused' : undefined}>
        <StyledInput
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          {...getInputProps()}
          placeholder="Search..."
          onKeyDown={handleKeyDown} // Detect Enter key
        />
        {hasClearIcon && (
          <StyledClearIndicator {...getClearProps()}>
            <ClearIcon />
          </StyledClearIndicator>
        )}
        <StyledSearchIcon onClick={handleSearch}> {/* Click on magnifying glass */}
          <SearchIcon />
        </StyledSearchIcon>
      </StyledAutocompleteRoot>
      {anchorEl && shouldShowSuggestions && groupedOptions.length > 0 && (
        <Popper open={popupOpen} anchorEl={anchorEl} style={{ zIndex: 1001 }}>
          <StyledListbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => {
              const optionProps = getOptionProps({ option, index });
              return <StyledOption {...optionProps} key={option.label}>{option.label}</StyledOption>;
            })}
            {groupedOptions.length === 0 && <StyledNoOptions>No results</StyledNoOptions>}
          </StyledListbox>
        </Popper>
      )}
    </React.Fragment>
  );
});
 
CustomAutocomplete.propTypes = {
  disableClearable: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};
 
export default function Barrederecherche() {
  const [products, setProducts] = React.useState([]);
  const [filteredOptions, setFilteredOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
 
  React.useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'Product'));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        label: doc.data().Product_name, // Keep original case for display
      }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);
 
  // Update filtered options as inputValue changes
  React.useEffect(() => {
    if (inputValue.trim()) {
      const lowercasedInput = inputValue.toLowerCase(); // Convert input to lowercase
      const matchingOptions = products.filter(product =>
        product.label.toLowerCase().includes(lowercasedInput) // Convert product names to lowercase for comparison
      );
      setFilteredOptions(matchingOptions); // Use original names for display
    } else {
      setFilteredOptions([]); // Clear suggestions if input is empty
    }
  }, [inputValue, products]);
 
  return (
    <CustomAutocomplete
      options={filteredOptions} // Use filtered options
      inputValue={inputValue} // Controlled input value
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Handle input changes
    />
  );
}
  const StyledAutocompleteRoot = styled('div')`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 12px;  // Rounded corners
    display: flex;
    gap: 10px;  // More space between the input and the icon
    padding: 8px;  // Added padding around the content
    overflow: hidden;
    height : 42px;
    width: 700px;  // Increased width for a larger search bar
    border: 2px solid ${grey[300]};
    background-color: white;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);  // Stronger shadow for more elevation
  `;
 
  const StyledInput = styled('input')`
    font-size: 1rem;  // Bigger font size for better readability
    padding: 12px 16px;  // Larger padding for a more spacious feel
    flex: 1 0 auto;
    border: none;
    outline: 0;
    border-radius: 10px;  // Rounded input field
    box-sizing: border-box;
  `;
 
  const StyledSearchIcon = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    cursor: pointer;
    font-size: 1.3rem;  // Increased icon size for better visibility
    color: #007bff;  // Blue color for the search icon to match with the theme
  `;
 
  const StyledClearIndicator = styled('div')`
    display: flex;
    align-items: center;
  `;
 
  const StyledListbox = styled('ul')`
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 1rem;  // Increased font size for list options
    max-height: 300px;
    overflow: auto;
    width: 400px;  // Match the width of the input
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid ${grey[300]};
    border-radius: 12px;
  `;
 
  const StyledOption = styled('li')`
    padding: 12px;
    cursor: pointer;
    &:hover {
      background-color: ${grey[200]};
    }
  `;
 
  const StyledNoOptions = styled('li')`
    padding: 12px;
    cursor: default;
    color: ${grey[600]};
    text-align: center;
  `;
