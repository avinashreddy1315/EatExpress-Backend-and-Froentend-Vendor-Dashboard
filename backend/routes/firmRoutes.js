const express = require('express');
const firmRoutes  = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();


/*firm route where it will take he middlewares as the verifyToken 
  so once the verifytoken function is done and it sets the req.vendorId = vendorData._id
  it will proceed for next() function*/
router.post('/add-firm', verifyToken, firmRoutes.addFirm);

router.delete('/:firmId', firmRoutes.deleteFirmById)
router.patch('/update-firm/:firmId', firmRoutes.updateFirmByFirmId)


router.get('/uploads/:imageName', (req, res)=>{
  const imageName = req. params.imageName;
  req.headerSent('content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

module.exports = router;
