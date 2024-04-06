const express = require('express');
const router = express.Router();
const {createRestaurant,
        upload,
        getRestaurants,
        getRestaurantById,
        deleteRestaurant,
        updateRestaurant } = require('../controllers/RestaurantControllers');

// Route to create  a new restaurant by
router.post('/createRestaurant',upload.single('Rest_logo'),createRestaurant);
// Route to get all restaurants
router.get('/restaurants',getRestaurants);
// Route to get a restaurant by ID
// router.get('/restaurant/:id', getRestaurantById);
router.get('/restaurant/', getRestaurantById);
// Route to delete a restaurant by ID
// router.delete('/restaurant/:id', deleteRestaurant);
 router.delete('/restaurant/', deleteRestaurant);
// Route to update a restaurant by ID
router.put('/restaurant/:id',upload.single('Rest_logo'),updateRestaurant);

// router.put('/restaurant/:id', updateRestaurant);

module.exports=router;


/**
Apologies for the confusion. Let me clarify:

In JavaScript, when you pass a function without parentheses () as an argument, you are passing a reference to that function. 
This means that the function is not executed immediately, but rather it will be called later when needed.

So when you write createRestaurant without parentheses () in router.post('/createRestaurant', upload.single('image'), createRestaurant);, 
you are telling Express to use the createRestaurant function as the callback for handling the POST request to the '/createRestaurant' route.

However, if you write createRestaurant() with parentheses () like router.post('/createRestaurant', upload.single('image'), createRestaurant());, 
you are actually calling the createRestaurant function immediately and passing its return value (which is likely a Promise in this case) as the callback function to router.post(). This is not what you want because Express expects a function reference to use as the callback, not the result of calling the function. */