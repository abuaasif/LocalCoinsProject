const express = require('express');
const router = express.Router();
const { createGrocery,getGroceryById,updategrocery,deletegrocery,getAllGrocerys,getsubCategory,
        upload,

    } = require('../controllers/groceryproductcontroller');

// Route to Create Product 
router.post('/createGrocery', upload.array('images',5), createGrocery)
// Route to get the all the grocerys
router.get('/groceries/all',getAllGrocerys)

router.get('/getGroceryById',getGroceryById)

// router.put('/updategrocery/:id',upload.array('images',5),updategrocery )
router.put('/updategrocery',upload.array('images',5),updategrocery )

router.delete('/deletegrocery',deletegrocery);

// Route to Create Product 
router.get('/groceries/',getsubCategory);




module.exports = router;