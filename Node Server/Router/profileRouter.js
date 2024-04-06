const express = require('express');
const router = express.Router();
const { createprofile,
        upload,
        updateprofile,
        deleteprofile,
        getprofile,
        getprofileById,
        
}=require('../controllers/profileController');

router.post('/createprofile',upload.single('image'),createprofile)
router.put('/updateprofile/:id',upload.single('image'),updateprofile)
router.delete('/profile/',deleteprofile);
router.get('/getprofile',getprofile );
router.get('/profile/',getprofileById );

module.exports= router;