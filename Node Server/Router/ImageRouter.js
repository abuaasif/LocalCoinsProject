const express = require('express');
const router = express.Router();
const { filterImagesByKeyword
    } = require('../controllers/ImageController');


// Example route that uses the filtering middleware
router.use('/filtered-images', filterImagesByKeyword);

module.exports = router;