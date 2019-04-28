const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
     destination: function(req, file, cb){
          cb(null, './uploads/');
    },
    filename: function(req, file, cb){
         cb(null, new Date().toISOString().replace(/:|\./g,'-') + file.originalname);
     }
});

const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 3},
    fileFilter: fileFilter
});

//var upload = multer({ dest: 'uploads/' })

const Product = require('../models/product');

router.get('/', ProductsController.get_products_all); 

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_products_all);

router.get('/:productId', ProductsController.Products_get_all);

router.patch('/:productId', checkAuth, ProductsController.Products_update_all);

router.delete('/:productId', checkAuth, ProductsController.Products_delete_all);

module.exports = router;