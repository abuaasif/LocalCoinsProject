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
  const [showUploadManually, setShowUploadManually] = useState(false);
  const [images, setImages] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    category: '', // Default category
    currency: '',
    quantity: '',
    price: '',
    description: '',
    rating: '', // Initialize rating here
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
            category: data[0].category // Corrected index to 0
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
          setSelectedCurrencySymbol(data[0].currency_symbol); // Corrected index to 0
          setFormData(prevState => ({ ...prevState, currency: data[0].currency_code })); // Corrected index to 0
        }
      } catch (error) {
        console.error('There was a problem fetching the currencies:', error);
      }
    };
    if (showGallery) {
      const fetchGalleryImages = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/filtered-images?keyword=${formData.name}`);
          if (!response.ok) {
            setGalleryImages([]);
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data.message && data.message === "No matching files found") {
            setShowUploadManually(true); // Show the manual upload option
          } else {
            const { files } = data;
            setGalleryImages(files);
            setShowUploadManually(false); // Ensure the manual upload option is hidden if images are found
          }
        } catch (error) {
          console.error('There was a problem fetching the images:', error);
        }
      };
      fetchGalleryImages();
    }
    fetchCategories();
    fetchCurrencies();
  }, [formData.name, showGallery]);

  const handleImageSelection = (imageUrl) => {
    setSelectedImages(prevState => {
      if (prevState.includes(imageUrl)) {
        return prevState.filter(url => url !== imageUrl);
      } else {
        return [...prevState, imageUrl];
      }
    });
  };

  const handleUploadImages = () => {
    setFormData(prevState => ({
      ...prevState,
      images: selectedImages
    }));
    setShowGallery(false); // Hide the gallery after uploading
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCurrencyChange = (e) => {
    const selectedSymbol = currencies.find(currency => currency.currency_code === e.target.value)?.currency_symbol;
    if (selectedSymbol) {
      setSelectedCurrencySymbol(selectedSymbol);
      setFormData(prevState => ({ ...prevState, currency: e.target.value }));
    }
  };


  const handleImageChange = (e) => {
    const key = e.target.id;
    // setFormData(prevState => ({ ...prevState, images: e.target.files[0] }));
    // Update the images state with the new file, preserving existing ones
    setImages({
      ...images,
      [key]: e.target.files[0], // Assuming you want to handle one file per input
    });
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
    if (missingFields.length > 0) {
      // Display a toast message indicating the missing fields
      toast.error(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return; // Prevent the form submission
    }
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    Object.keys(images).forEach((key, index) => {
      // Use a more descriptive name for your files if necessary
      formDataToSend.append(`images`, images[key]);
    });


    try {


      const response = await fetch('http://localhost:3001/api/createProduct', {
        method: 'POST',
        body: formDataToSend
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
      <div className="container mt-6" >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6" style={{ marginTop: '130px' }}> {/* First sub-grid */}
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange}
                  onFocus={() => setShowGallery(true)} // Show the gallery when the product name field is focused
                />
              </div>
              <div className="form-group">
                <label htmlFor="categorySelect">Select Category</label>
                <select className="form-control"
                  id="categorySelect" name="category" value={formData.category} onChange={handleInputChange}
                  onFocus={() => setShowGallery(false)} // Show the gallery when the product name field is focused
                >
                  {Categories.map(categories => (
                    <option key={categories.procat_id} value={categories.category}>
                      {categories.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" className="form-control" name="description" placeholder="Message" value={formData.description} onChange={handleInputChange}
                  onFocus={() => setShowGallery(false)} ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="price">Quantity</label>
                <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange}
                  onFocus={() => setShowGallery(false)} />
              </div>
            </div>

            <div className="col-md-6" style={{ marginTop: '130px' }}> {/* Second column in the first sub-grid */}
              <div className="form-group">
                <label htmlFor="currencySelect">Currency</label>
                <select className="form-control"
                  id="categorySelect" name="currency" value={formData.currency}
                  onChange={handleCurrencyChange} onFocus={() => setShowGallery(false)}>
                  {currencies.map(currency => (
                    <option key={currency.currency_id} value={currency.currency_code}>
                      {currency.currency_code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price ({selectedCurrencySymbol})</label>
                <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleInputChange}
                  onFocus={() => setShowGallery(false)} />
              </div>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input type="number" className="form-control" id="rating" name="rating" min="1" max="5" value={formData.rating} onChange={handleInputChange}
                  onFocus={() => setShowGallery(false)} />
              </div>
              {galleryImages.length <= 0 && (<div className="form-group" style={{ marginTop: '60px' }}>
                <div>
                  <label htmlFor="Image">Upload Image Manually</label>
                  <input type="file" className="btn btn-success me-2" id="images" name="images" onChange={handleImageChange} style={{ height: '45px', width: '250px' }} />
                </div>
              </div>)}
            </div>
          </div>
          {showGallery && galleryImages.length > 0 && (
            <div className="row mt-3"> {/* Second sub-grid for the image gallery */}
              <div className="col">
                {/* Image Gallery goes here. Use a component or logic to render selected images */}
                <div className="image-gallery-container p-4 bg-light border rounded-3 mb-4 shadow" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  {/* Container for image thumbnails */}
                  <div className="row g-3">
                    {galleryImages.length > 0 && (<p>Image Gallery</p>)}
                    <div className="row">
                      {galleryImages.length > 0 && (
                        <div className="row">
                          {galleryImages.map(image => (
                            <div className="col-6 col-sm-4 col-md-3 custom-col" key={image.id}>
                              <div className="card h-100 shadow-sm">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="card-img-top"
                                  style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                                />
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
                      )}
                    </div>
                  </div>
                  {/* Buttons for uploading selected images or cancelling */}
                </div>
                {galleryImages.length > 0 && (
                  <div className="mt-3 text-end">
                    <button className="btn btn-success me-2" onClick={handleUploadImages}>Upload Selected</button>
                    <button className="btn btn-outline-secondary" onClick={() => setShowGallery(false)}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary mt-3">Submit</button>
        </form>
      </div>
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

