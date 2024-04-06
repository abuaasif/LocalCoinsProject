const express = require('express');
const router = express.Router();
const { createmeat,getAllmeats,getmeatById,updatemeats, deletemeats, upload} = require('../controllers/MeatProController');


router.post('/createmeat', upload.array('images',5), createmeat)
router.get('/getAllmeats',getAllmeats);
router.get('/getmeatById',getmeatById);
router.put('/updatemeats',upload.array('images',5),updatemeats);
router.delete('/deletemeats',deletemeats);

module.exports = router;