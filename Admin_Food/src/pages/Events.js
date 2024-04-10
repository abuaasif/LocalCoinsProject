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
  const [selectedImageTypes, setSelectedImageTypes] = useState({});
  const [previewImage, setPreviewImage] = useState({});

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
          setSelectedCurrencySymbol(data[5].currency_symbol); // Corrected index to 0
          setFormData(prevState => ({ ...prevState, currency: data[5].currency_code })); // Corrected index to 0
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

  const handleImageSelection = (selectedImage) => {
    setSelectedImages(prevState => {
      if (prevState.some(image => image.url === selectedImage.url)) {
        return prevState.filter(image => image.url !== selectedImage.url);
      } else {
        return [...prevState, selectedImage];
      }
    });
    setSelectedImageTypes(prevState => ({
      ...prevState,
      [selectedImage.url]: galleryImages.find(image => image.url === selectedImage.url)?.type, // Find file type from gallery images
    }));
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages({
          ...images,
          [e.target.name]: file,
        });
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUploadImages = () => {
    // Hide the gallery after uploading
    setShowGallery(false);

    // Ensure selectedImages is an array of image URLs
    const selectedImageUrls = selectedImages.map(image => image.url);

    // Update the form data with the selected image URLs
    setImages(prevState => ({
      ...prevState,
      images: selectedImageUrls
    }));
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

    // Append other form data
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });


    Object.keys(images).forEach((key,index)=>{
      formDataToSend.append('images',images[key])
    });

      // Check if an image file is selected
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
          <div className="row" >
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
              {galleryImages.length <= 0 && selectedImages.length < 1 && (<div className="form-group" style={{ marginTop: '60px' }}>
                <div>
                  <label htmlFor="images"></label>
                  <input type="file" className="btn btn-success me-2" id="images" name="images" onChange={handleImageChange} style={{ display: 'none' }} />
                  <button className="btn btn-success me-2" onClick={() => document.getElementById('images').click()} style={{ height: '45px', width: '250px' }}>
                    Select Image
                  </button>
                </div>
                {previewImage && (
                  <div>
                    <h3>Preview</h3>
                    <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  </div>
                )}

              </div>)}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selectedImages.map(image => (
                  <div key={image.url} style={{ flex: '0 0 auto', width: '200px', margin: '10px', textAlign: 'center' }}>
                    <img src={image.url} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    <p>{galleryImages.find(img => img.url === image.url)?.name}</p>
                  </div>
                ))}
              </div>


            </div>
          </div>
          {showGallery && galleryImages.length > 0 && (
            <div className="row mt-3"> {/* Second sub-grid for the image gallery */}
              <div className="col">
                {/* Image Gallery goes here. Use a component or logic to render selected images */}
                <div className="image-gallery-container p-4 bg-light border rounded-3 mb-4 shadow" style={{ maxHeight: '400px', width: '100%', overflowY: 'scroll' }}>
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
                                      checked={selectedImages.some(selectedImage => selectedImage.url === image.url)}
                                      onChange={() => handleImageSelection(image)}
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
