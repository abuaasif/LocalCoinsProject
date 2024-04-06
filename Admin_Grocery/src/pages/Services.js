// // Filename - pages/Services.js

// import React from "react";

// export const Services = () => {
// 	return (
// 		<div className="services">
// 			<h2>Our Products</h2>
// 		</div>
// 	);
// };

// export const ServicesOne = () => {
// 	return (
// 		<div className="services">
// 			<h2>Product1</h2>
// 		</div>
// 	);
// };

// export const ServicesTwo = () => {
// 	return (
// 		<div className="services">
// 			<h2>Product 2</h2>
// 		</div>
// 	);
// };

// export const ServicesThree = () => {
// 	return (
// 		<div className="services">
// 			<h2>Product 3</h2>
// 		</div>
// 	);
// };

// Filename - pages/Services.js

// Filename - pages/Services.js

import React from "react";
import './Service.css'; // Import the CSS file for styling

export const Services = () => {
  return (
    <div className="services">
      
    </div>
  );
};

export const ServicesOne = () => {
  return (
    <div className="services-details">
      
      <div className="input-group">
        <label htmlFor="image">Image upload option</label>
        <input type="file" id="image" name="image" />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" placeholder="Enter description"></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" placeholder="Enter address" />
      </div>
      <div className="input-group">
        <label htmlFor="openingTime">Opening Time</label>
        <input type="time" id="openingTime" name="openingTime" />
      </div>
      <div className="input-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Enter name" />
      </div>
      <div className="input-group">
        <label htmlFor="phone">Phone</label>
        <input type="text" id="phone" name="phone" placeholder="Enter phone" />
      </div>
      <div className="input-group">
        <label htmlFor="manager">Manager</label>
        <input type="text" id="manager" name="manager" placeholder="Enter manager" />
      </div>
      <div className="input-group">
        <label htmlFor="closingTime">Closing Time</label>
        <input type="time" id="closingTime" name="closingTime" />
      </div>
      <input type="submit" value="Submit" /> {/* Submit button */}
    </div>
  );
};

export const ServicesTwo = () => {
  return (
    <div className="services">
      <h2>Product 2</h2>
    </div>
  );
};

export const ServicesThree = () => {
  return (
    <div className="services">
      <h2>Product 3</h2>
    </div>
  );
};
