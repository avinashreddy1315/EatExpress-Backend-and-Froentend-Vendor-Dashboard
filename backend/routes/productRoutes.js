const express = require('express');
const productController = require('../controllers/productController')

const router = express.Router()


router.post('/add-product/:firmId', productController.addProduct)
router.get('/get-products/:firmId', productController.getProductsByFirm)
router.delete('/:productId', productController.deleteProductById)

router.get('/uploads/:imageName', (req, res)=>{
    const imageName = req. params.imageName;
    req.headerSent('content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
  })


module.exports = router;