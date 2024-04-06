const express = require('express');
const router = express.Router();
const {createMeat,upload,getMeats,getMeatsById,deleteMeat,updateMeat,getMeatbyCategory} =require('../controllers/MeatProController');
// Route to Create Product 
router.post('/createMeat', upload.single('image'), createMeat)

// Route to get all groceries
router.get('/getmeats', getMeats);

// Route to get all groceries matching category
// Assuming category is passed as a query parameter
router.get('/getmeats/cat/', getMeatbyCategory)

// Route to get a Grocery by ID
// Ensure the route parameter ':id' is specified for routes that require an ID
router.get('/meat/', getMeatsById);

// Route to delete a Grocery by ID
router.delete('/meat/', deleteMeat);

// Route to Update Grocery
router.put('/updateMeat/:id', upload.single('image'), updateMeat);

module.exports = router;
