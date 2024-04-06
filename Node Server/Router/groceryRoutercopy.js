const express = require('express');
const router = express.Router();
const { createGrocery,
        upload,
        getGrocerys,
        getGrocerysById,
        deleteGrocery,
        updateGrocery,
        getGrocerybyCategory
    } = require('../controllers/groceryproductcontroller');

// Route to Create Product 
router.post('/createGrocery', upload.single('image'), createGrocery)

// Route to get all groceries
router.get('/getgrocerys', getGrocerys);

// Route to get all groceries matching category
// Assuming category is passed as a query parameter
router.get('/getgrocerys/cat/', getGrocerybyCategory)

// Route to get a Grocery by ID
// Ensure the route parameter ':id' is specified for routes that require an ID
router.get('/grocery/', getGrocerysById);

// Route to delete a Grocery by ID
router.delete('/grocery/', deleteGrocery);

// Route to Update Grocery
router.put('/updateGrocery/:id', upload.single('image'), updateGrocery);

module.exports = router;
