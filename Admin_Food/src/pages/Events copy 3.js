import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';

export const EventsOne = () => {
  const [showUploadManually, setShowUploadManually] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false); // For controlling the display of the image gallery
  const [galleryImages, setGalleryImages] = useState([]);
  const [isImageSelected, setIsImageSelected] = useState(false);


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

  useEffect(() => {
    axios.get('http://localhost:3001/api/food')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3001/api/currencies')
      .then(res => {
        setCurrencies(res.data);
        const defaultCurrency = res.data.find(currency => currency.currency_code === 'INR');
        if (defaultCurrency) setCurrencySymbol(defaultCurrency.currency_symbol);
      })
      .catch(err => console.error(err));

    if (showGallery) {
      const fetchGalleryImages = async () => {
        setGalleryImages([]);
        try {
          const response = await fetch(`http://localhost:3001/api/filtered-images?keyword=${productName}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();

          if (data.message && data.message === "No matching files found") {
            setGalleryImages([]);
            setShowUploadManually(true); // Show the manual upload option
            toast.info(data.message);
          } else {
            const { files } = data;
            setGalleryImages(files);
            setShowUploadManually(false); // Ensure the manual upload option is hidden if images are found
          }
        } catch (error) {
          console.error('There was a problem fetching the images:', error);
          toast.error(`Error fetching images: ${error.message}`);
        }
      };


      fetchGalleryImages();

    }
  }, [productName, showGallery]);

  const handleCurrencyChange = (e) => {
    const selectedCurrencyCode = e.target.value;
    setCurrencyCode(selectedCurrencyCode);
    const selectedCurrency = currencies.find(currency => currency.currency_code === selectedCurrencyCode);
    if (selectedCurrency) setCurrencySymbol(selectedCurrency.currency_symbol);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct form data
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('rating', rating);
    formData.append('currency', currencyCode);
    formData.append('select_category', categories);

    // Append images and other fields as needed

    // Axios POST request to submit the form data
    axios.post('http://localhost:3001/api/createProduct', formData)
      .then(response => {
        console.log(response.data);
        // Handle success
      })
      .catch(error => {
        console.error(error);
        // Handle error
      });
  };

  const handleImageSelection = (imageUrl) => {
    const updatedSelectedImages = selectedImages.includes(imageUrl)
      ? selectedImages.filter(url => url !== imageUrl) // Remove deselected image
      : [...selectedImages, imageUrl]; // Add selected image

    setSelectedImages(updatedSelectedImages);
    setIsImageSelected(updatedSelectedImages.length > 0);
  };

  const handleUploadImages = () => {
    // This example assumes your images are identified by their ID and you're storing just the IDs in formData
    setFormData({ ...formData, images: selectedImages });
    setShowGallery(false); // Hide the gallery after uploading
    setSelectedImages([]); // Clear selections
  };


  return (
    <div className="container mt-6">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6" style={{ marginTop: '100px' }}> {/* First sub-grid */}
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input type="text" className="form-control" id="productName" value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onFocus={() => setShowGallery(true)} // Show the gallery when the product name field is focused
              />
            </div>
            <div className="form-group">
              <label htmlFor="categorySelect">Select Category</label>
              <select
                className="form-control"
                id="categorySelect" value={categories}
                onChange={(e) => console.log(e.target.value)}
                onFocus={() => setShowGallery(false)} >
                {categories.map((category) => (
                  <option key={category.procat_id} value={category.procat_id}>{category.category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea className="form-control"
                id="description"
                rows="3" value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setShowGallery(false)} ></textarea>
            </div>
          </div>

          <div className="col-md-6" style={{ marginTop: '100px' }}> {/* Second column in the first sub-grid */}
            <div className="form-group">
              <label htmlFor="currencySelect">Currency</label>
              <select className="form-control" id="currencySelect" value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                onFocus={() => setShowGallery(false)} >
                {currencies.map((currency, index) => (
                  <option key={index} value={currency.currency_code}>{currency.currency_code}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ({currencySymbol})</label>
              <input type="text" className="form-control" id="price" value={price}
                onChange={(e) => setPrice(e.target.value)}
                onFocus={() => setShowGallery(false)} />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <input type="number" className="form-control" id="rating" value={rating}
                onChange={(e) => setRating(e.target.value)} min="0" max="5"
                onFocus={() => setShowGallery(false)} />
            </div>
          </div>
        </div>
        {showGallery && (
          <div className="row mt-3"> {/* Second sub-grid for the image gallery */}
            <div className="col">
              {/* Image Gallery goes here. Use a component or logic to render selected images */}
              <div className="image-gallery-container p-4 bg-light border rounded-3 mb-4 shadow">

                {/* Container for image thumbnails */}
                <div className="row g-3">
                  {galleryImages.length > 0 && (<p>Image Gallery</p>)}
                  <div style={{ maxHeight: '320px', overflowY: 'scroll', scrollBehavior: 'smooth', }}>
                    <div className="row">
                      {galleryImages.length > 0 && (
                        <div className="row">
                          {galleryImages.map(image => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={image.id}>
                              <div className="card h-100 shadow-sm">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="card-img-top"
                                  style={{
                                    objectFit: 'cover',
                                    height: '150px',
                                    width: '150px'  // Ensure the width is also fixed along with the height
                                  }}
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
                  {galleryImages.length <= 0 && (<div className="text-center p-3">

                    <div >
                      <input type="file" className="btn btn-success me-2" id="images" name="images" onChange={handleUploadImages}   style={{ height: '45px', width: '250px' }} />
                    </div>
                  </div>)}
                </div>
                {/* Buttons for uploading selected images or cancelling */}
                {galleryImages.length > 0 && (
                  <div className="mt-3 text-end">
                    <button className="btn btn-success me-2" onClick={handleUploadImages}>Upload Selected</button>
                    <button className="btn btn-outline-secondary" onClick={() => setShowGallery(false)}>Cancel</button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-3" >Submit</button>
      </form>
      
    </div>
  );
}

export const Events = () => {
  return (
    <div className="events">
      <h1>Events</h1>
    </div>

  );
};
export const EventsTwo = () => {
  return (
    <div className="events">
      <h1>Event2</h1>
    </div>
  );
};