const express = require('express');
const { getCurrencies } = require('../Controllers/CurrenciesController');
const router = express.Router();


router.get('/currencies',getCurrencies)

module.exports=router;