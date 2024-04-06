// Filename - pages/Events.js

import React, { useState, useEffect } from "react";
import './Events.css'; // Import the CSS file for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';


export const Events = () => {
  return (
    <div className="events">
      <h1>Events</h1>
    </div>

  );
};


export const EventsOne = () => {
  const [currencies, setCurrencies] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);


  const [formData, setFormData] = useState({
    name: '',
    category: '', // Default category
    currency: '',
    quantity: '',
    price: '',
    description: '',
    rating: '', // Initialize rating here
    images: [], // For image file
  });
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/food');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data); // Set the categories state
        if (data.length > 0) {
          // Set the default category to the first item
          setFormData(prevState => ({
            ...prevState,
            category: data[4].category // Assuming 'category' is the correct property
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
          setSelectedCurrencySymbol(data[5].currency_symbol);
          setFormData(prevState => ({ ...prevState, currency: data[5].currency_code }));
        }
      } catch (error) {
        console.error('There was a problem fetching the currencies:', error);
      }
    };
    if (showGallery) {
      const fetchGalleryImages = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/filtered-images?keyword=${searchKeyword}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const { totalFiles, files } = data
          setGalleryImages(files);
        } catch (error) {
          console.error('There was a problem fetching the images:', error);
          toast.error(`Error fetching images: ${error.message}`);
        }
      };
      fetchGalleryImages();

    }
    fetchCategories();
    fetchCurrencies();
  }, [searchKeyword, showGallery]);

  const handleImageSelection = (imageId) => {
    const isSelected = selectedImages.includes(imageId);
    setSelectedImages(isSelected ? selectedImages.filter(id => id !== imageId) : [...selectedImages, imageId]);
  };
  const handleUploadImages = () => {
    // This example assumes your images are identified by their ID and you're storing just the IDs in formData
    setFormData({ ...formData, images: selectedImages });
    setShowGallery(false); // Hide the gallery after uploading
    // setSelectedImages([]); // Clear selections
  };


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

  const handleImageChange = (e) => {
    setFormData(prevState => ({ ...prevState, images: e.target.files[0] }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for mandatory fields
    const mandatoryFields = ['name', 'category', 'currency', 'quantity', 'price', 'description'];
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
      const response = await fetch('http://localhost:3001/api/createProduct', {
        method: 'POST',
        body: formDataToSend, // FormData will correctly handle the file upload
      });

      if (!response.ok) throw new Error('Failed to submit product');
      toast.success('Product successfully added');

      navigate('/ProductsList'); // Navigate on success

    } catch (error) {
      toast.error(`Submission error: ${error.message}`);
    }
  };



  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <form className="row g-3 events-details" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Product name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="category" className="form-label">Select Category</label>
          <select className="form-select category-select" id="category" name="category" value={formData.select_category} onChange={handleInputChange}>
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
          <input type="file" className="form-control" id="images" name="images" onChange={handleImageChange} />
        </div>
        <div className="col-md-12">
          <input type="submit" value="Submit" className="submit-button" />
        </div>
        <button type="button" className="btn btn-primary mb-3" onClick={() => setShowGallery(true)}>Add Images</button>
        {/* Image gallery container */}
        {showGallery && (
  <div className="image-gallery-container p-4 bg-light border rounded-3 mb-4 shadow">
    {/* Search input for filtering images */}
    <div className="mb-3">
      <input 
        type="text" 
        className="form-control" 
        placeholder="Search images..." 
        onChange={e => setSearchKeyword(e.target.value)} 
      />
    </div>
    {/* Container for image thumbnails */}
    <div className="row g-3">
      {galleryImages.map(image => (
        <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={image.id}> {/* Adjusted classes for responsiveness */}
          <div className="card h-100 shadow-sm"> {/* Added shadow-sm for subtle shadow */}
            {/* Ensuring image size consistency */}
            <img src={image.url} alt={image.name} className="card-img-top" style={{objectFit: 'cover', height: '150px'}} />
            <div className="card-body p-2">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={selectedImages.includes(image.url)} 
                  onChange={() => handleImageSelection(image.url)} 
                  id={`image-check-${image.url}`}
                />
                <label className="form-check-label small" htmlFor={`image-check-${image.id}`}>
                  {image.name}
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Buttons for uploading selected images or cancelling */}
    <div className="mt-3 text-end">
      <button className="btn btn-success me-2" onClick={handleUploadImages}>Upload Selected</button>
      <button className="btn btn-outline-secondary" onClick={() => setShowGallery(false)}>Cancel</button>
    </div>
  </div>
)}



      </form>

    </>
  );

};

export const EventsTwo = () => {
  return (
    <div className="events">
      <h1>Event2</h1>
    </div>
  );
};

