// Filename - pages/Events.js

import React, { useState, useEffect } from "react";
import './Events.css'; // Import the CSS file for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useParams hook

 

const Updategrocery = () => {
  const [currencies, setCurrencies] = useState([]);
  const [Categories, setCategories] = useState([]);
  const { product_id } = useParams();
  const location = useLocation();
  // console.log(location)
  const productId= location.state.product_id
  // console.log('Product ID:', productId);
  // Now you can use the product_id variable here
  // For example:
  console.log('Product ID:', productId);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('');
  const [formData, setFormData] = useState({
    product_name: '',
    select_category: '', // Default category
    currency: '',
    quantity: '',
    price: '',
    description: '',
    rating: '', // Initialize rating here
    images: null, // For image file
  });
  const { id } = useParams(); // Accessing the product ID from URL params
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data); // Set the categories state
        if (data.length > 0) {
          // Set the default category to the first item
          setFormData(prevState => ({
            ...prevState,
            select_category: data[4].category // Assuming 'category' is the correct property
          }));
        }
      } catch (error) {
        console.error('There was a problem fetching the categories:', error);
        toast.error(`Error fetching categories: ${error.message}`);
      }
    };
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/currencies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCurrencies(data);
        if (data.length > 0) {
          setSelectedCurrencySymbol(data[0].currency_symbol);
          setFormData(prevState => ({ ...prevState, currency: data[0].currency_code }));
        }
      } catch (error) {
        console.error('There was a problem fetching the currencies:', error);
      }
    };
    const fetchProductDetails = async () => {
      try {
        // const response = await fetch(`http://localhost:3001/api/product/?id=${product_id}`);
        const response = await fetch(`http://localhost:3001/api/getGroceryById?id=${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const productDetails = await response.json();
        setFormData({
          product_name: productDetails.product_name,
          select_category: productDetails.select_category,
          currency: productDetails.currency,
          quantity: productDetails.quantity.toString(),
          price: productDetails.price.toString(),
          description: productDetails.description,
          rating: productDetails.rating.toString(),
          images: productDetails.image1,
        });
        // Set the selectedCurrencySymbol based on the fetched currency
        setSelectedCurrencySymbol(currencies.find(currency => currency.currency_code === productDetails.currency)?.currency_symbol || '');
      } catch (error) {
        console.error('There was a problem fetching the product details:', error);
        toast.error(`Error fetching product details: ${error.message}`);
      }
    };


    fetchCategories();
    fetchCurrencies();
    fetchProductDetails();
  }, [id]);

  console.log(formData.images);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCurrencyChange = (e) => {
    const selectedSymbol = currencies.find(currency => currency.currency_code === e.target.value)?.currency_symbol;
    if (selectedSymbol) {
      setSelectedCurrencySymbol(selectedSymbol);
      setFormData(prevState => ({ ...prevState, currency: e.target.value }));
    }
  };

  const handleImageChange = (e,Filename) => {
    setFormData(prevState => ({ ...prevState, images: e.target.files[0] }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    // Check for mandatory fields
    const mandatoryFields = ['product_name', 'select_category', 'currency', 'quantity', 'price', 'description'];
    const missingFields = mandatoryFields.filter(field => !formData[field] || formData[field].trim() === '');

    if (missingFields.length > 0) {
      // Display a toast message indicating the missing fields
      toast.error(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return; // Prevent the form submission
    }
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      // const response = await fetch(`http://localhost:3001/api/updateProduct/${product_id}`, {
        const response = await fetch(`http://localhost:3001/api/updategrocery?id=${productId}`, {
        method: 'PUT', // Change method to PUT
        body: formDataToSend, // FormData will correctly handle the file upload
      });

      if (!response.ok) throw new Error('Failed to submit product');
      toast.success('Product successfully added');

      navigate('/ProductsList'); // Navigate on success

    } catch (error) {
      toast.error(`Submission error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    // Implement the cancel action here
    navigate('/ProductsList');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <form className="row g-3 events-details" onSubmit={handleSave}>
        <div className="col-md-6">
          <label htmlFor="product_name" className="form-label">Product name</label>
          <input type="text" className="form-control" id="product_name" name="product_name" value={formData.product_name} onChange={handleInputChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="select_category" className="form-label">Select Category</label>
          <select className="form-select category-select" id="select_category" name="select_category" value={formData.select_category} onChange={handleInputChange}>
            {/* <option>Category 1</option>
          <option>Category 2</option>
          <option>Category 3</option> */}
            {Categories.map(categories => (
              <option key={categories.procat_id} value={categories.category}>
                {categories.category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="currency" className="form-label">Currency</label>
          <select id="currency" className="form-select category-select" name="currency" value={formData.currency} onChange={handleCurrencyChange}>
            {currencies.map(currency => (
              <option key={currency.currency_id} value={currency.currency_code}>
                {currency.currency_code}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="price" className="form-label">Price</label>
          <div className="input-group">
            <span className="input-group-text">{selectedCurrencySymbol}</span>
            <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleInputChange} />
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea id="description" className="form-control" name="description" placeholder="Message" value={formData.description} onChange={handleInputChange}></textarea>
        </div>
        <div className="col-md-6">
          <label htmlFor="rating" className="form-label">Rating</label>
          <input type="number" className="form-control" id="rating" name="rating" min="1" max="5" value={formData.rating} onChange={handleInputChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="image" className="form-label">Image</label>
          <img src={formData.images} />
          <input type="file" className="form-control" id="images" name="images" onChange={(e) => handleImageChange(e, formData.images)} />
        </div>
        <div className="col-md-12">
          <input type="submit" value="Update" className="submit-button" />
        </div>
        <div className="col-md-12"> 
        <input type="submit" onClick={handleCancel} value="Cancel" className="submit-button" />
        </div>
      </form>
    </>
  );

};

export default Updategrocery;
