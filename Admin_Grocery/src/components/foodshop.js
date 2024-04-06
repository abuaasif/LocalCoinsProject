import "./foodshop.css";
import { Link } from 'react-router-dom';
import shoppy from '../urbanshop/assests/shoppy.jpg';
import cip from '../urbanshop/assests/cip.jpg';
// import ccc from '../urbanshop/assests/ccc.jpg';
import banner4 from '../mid/mid images/banner4.png';
import Foot from "../mid/Foot";
import React, { useState, useEffect } from 'react';
const Host = 'http://localhost:3100'
 
// const Foodshop = () => {
//     const cardData = [
 
//         {
//          productName:"Santhosh Family Dhaba",
//          estimateddeliveryTime: "In 10 minutes",
//          deliveryStatus:"5.0 Review",
//          image:ccc,
//          image1:cip,
//         id :1,
//         },
//         {
//             productName:"Pista House",
//             estimateddeliveryTime: "In 12 minutes",
//             deliveryStatus:"4.0 Review",          
//             image:ccc,
//             image1:cip,
//             image2:shoppy,
//             id: 2,
//            },
//            {
//             productName:"Cream Stone",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",        
//             image:ccc,
//             image1:cip,
//             image2:shoppy,
//             id: 3,
 
 
//            },
//            {
//             productName:"Ram Ki Bandi",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",
//             image:ccc,
//          image1:cip,
//          image2:shoppy,
//             id: 4,
 
 
//            },
//            {
//             productName:"Friends Fast Food",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",
//             image:ccc,
//          image1:cip,
//          image2:shoppy,
//             id: 5,
 
 
//            },
//            {
//             productName:"Pizza Hut",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",
//             image:ccc,
//             image1:cip,
//             image2:shoppy,
//             id: 6,
 
 
//            },
//            {
//             productName:"Pizza Hut",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",
//             image:ccc,
//             image1:cip,
//             image2:shoppy,
//             id: 7,
 
 
//            },
//            {
//             productName:"Khadar",
//             estimateddeliveryTime: "In 19 minutes",
//             deliveryStatus:"4.3 Review",
//             image:ccc,
//             image1:cip,
//             image2:shoppy,
//             id: 8,
 
 
//            },
//           ]
const Foodshop = () => {
  const [cardData, setRestaurants] = useState([]);
 
  useEffect(() => {
    fetch(`${Host}/api/restaurants`)
      .then(response => response.json())
      .then(data => {
        const updatedRestaurants = data.map(restaurant => {
          return {
            productName: restaurant.name,
            estimateddeliveryTime: "In 19 minutes", // Example static value
            deliveryStatus: "4.3 Review", // Example static value
            // image: 'uploads/restaurant/artisan/temp_1707754824437.png',
            image:restaurant.Rest_image,
            image1: cip, // Assuming you want to keep these images static
            image2: shoppy, // Assuming you want to keep these images static
            id: 1,
          };
         
        });
        setRestaurants(updatedRestaurants);
      })
      .catch(error => console.error("Failed to fetch restaurants:", error));
  }, []); // Empty dependency array means this effect runs once on mount
 
  return (
    <div>
      <div className='banner4'>  <img src={banner4} alt="" /></div>
      <div className='t12'>
        {cardData.map((item, index) => {
          return (
 
            //   <div key={index}>{`/${item.path}`}
            <div className='tb-bhh'>
              <div>
                <img key={index} src={item.image1} alt='img' className='img-ii' />
              </div>
              <div className='divc'>
                <h1 className='tb-h'>{item.productName} </h1>
                <p className='tb-h1'>{item.estimateddeliveryTime}</p>
                <p className='free'> {item.deliveryStatus}</p>
                <div className='pup'>
                  <h4 className='hhup'> 4.2</h4>
                </div>
 
                <Link to={`/menu/${item.id}`} className='free-e'>View Details</Link>
                <img src={`${item.image}`} alt='img img' className='cc-i' />
              </div>
            </div>
 
            // </div>
 
          )
        })}
      </div>
      <Foot />
    </div>
  )
}
 
 
export default Foodshop;