const express = require('express');
const router = express.Router();
const { createProduct,
        upload,
        getProducts,
        getProductById,
        deleteProduct,
        updateProduct,
        getProductbyCategory,
        getAllProducts
    } = require('../controllers/ProductControllers');



// Route to Create Product with single image upload 
// router.post('/createProduct',upload.single('image'),createProduct)

// Route to Create Product with mul images
router.post('/createProduct',upload.array('images',5),createProduct)



// Route to get all restaurants
router.get('/getproducts',getProducts)

router.get('/getproducts/all',getAllProducts)

// Route to get all restaurants matching category
router.get('/getproducts/cat/',getProductbyCategory)


// Route to get a Product by ID
// router.get('/product/:id', getProductsById);
router.get('/product/', getProductById);

// Route to get a Product by ID
// router.get('/product/:id', getProductsById);
router.delete('/product/',deleteProduct);

// Route to Update Product 
// router.put('/updateProduct/:id',upload.single('image'),updateProduct)
router.put('/updateProduct/:id',upload.array('image',5),updateProduct)

module.exports = router;