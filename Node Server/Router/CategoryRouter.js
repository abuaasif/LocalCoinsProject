const express = require('express');
const { getCategory,getgrocycat,getmeatcate } = require('../Controllers/CategoryController');
const router = express.Router();


router.get('/food',getCategory)
router.get('/catgrocery',getgrocycat)
router.get('/catemeat',getmeatcate)

module.exports=router;