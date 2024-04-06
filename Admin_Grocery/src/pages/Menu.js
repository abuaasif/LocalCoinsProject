// Importing CSS styles for the menu component
import "./Menu.css";

// Importing the HiOutlinePlus icon from react-icons library
import { HiOutlinePlus } from "react-icons/hi";

// Importing necessary modules from React
import React, { useEffect, useState } from 'react';

// Importing axios for making HTTP requests
import axios from 'axios';

// Component for filtering menu items by category
const Filter = ({ filters, onChange }) => (
  <div className="menu-filter">
    {/* Select dropdown for filtering */}
    <select onChange={(e) => onChange(e.target.value)}>
      {/* Default option to show all */}
      <option value="">All</option>
      {/* Mapping over filters to generate options for each category */}
      {filters.map((filter) => (
        <option key={filter.procat_id} value={filter.category}>
          {filter.category}
        </option>
      ))}
    </select>
  </div>
);

// Component for sorting menu items by price
const Price = ({ onSort }) => (
  <div className="menu-price-filter">
    {/* Button to sort by price low to high */}
    <button onClick={() => onSort("priceLowToHigh")}>Price: Low to High</button>
    {/* Button to sort by price high to low */}
    <button onClick={() => onSort("priceHighToLow")}>Price: High to Low</button>
  </div>
);

// Component for rendering each menu item
const Item = ({ item }) => (
  <div className="ol">
    <div className="jj"></div>
    <div className="st">
      <div className="pot">
        <div className="bi">
          {/* Product name */}
          <h3 className="bir">{item.product_name}</h3>
          {/* Product price */}
          <p className="ir">Price: ₹{item.price}</p>
          {/* Product rating */}
          <p className="ir">Ratings: {item.rating}</p>
        </div>
      </div>
      <span >
        {/* Product image */}
        <img src={item.image} alt={item.product_name} className="cp" />
        {/* "Add" button */}
        <p className="dd">Add</p>
      </span>
    </div>
  </div>
);

// Main Menu component
const Menu = () => {
  // State variables for category filters, selected category filter, menu items, and selected price sort
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [priceSort, setPriceSort] = useState("");

  // Fetching category filters from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/api/categories')
      .then(response => {
        // Setting fetched category filters to state
        setCategoryFilters(response.data);
      })
      .catch(error => {
        console.error('Error fetching category filters:', error);
      });
  }, []);

  // Fetching products based on selected category filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Making HTTP request to fetch products based on category filter
        const response = await axios.get(`http://localhost:3001/api/getproducts?select_category=${categoryFilter}`);
        // Setting fetched products to state
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Calling fetchData function when categoryFilter state changes
    fetchData();
  }, [categoryFilter]);

  // Filtering products based on selected category filter
  const filteredData = products.filter(
    (item) => !categoryFilter || item.select_category === categoryFilter
  );

  // Sorting filtered products based on selected price sort
  const sortedData = () => {
    if (priceSort === "priceLowToHigh") {
      // Sorting products from low to high price
      return filteredData.slice().sort((a, b) => a.price - b.price);
    } else if (priceSort === "priceHighToLow") {
      // Sorting products from high to low price
      return filteredData.slice().sort((a, b) => b.price - a.price);
    } else {
      // Returning unsorted products if no price sort is selected
      return filteredData;
    }
  };

  // Rendering the menu component
  return (
    <div>
      <div className="menu-container">
        {/* Rendering category filter component */}
        <Filter
          filters={categoryFilters}
          onChange={setCategoryFilter}
        />
        {/* Rendering price filter component */}
        <Price onSort={setPriceSort} />
        {/* Rendering menu item container */}
        <div className="menu-item-container">
          {/* Mapping over sorted data and rendering each menu item */}
          {sortedData().map((item) => (
            <Item key={item.prod_id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Exporting Menu component as default
export default Menu;
