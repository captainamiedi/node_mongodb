const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');



const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require( '../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', (req, res, next) =>{
    Product.findById(req.body.productId)
        .then(product => {
            if (!product){
                return res.status(404).json({
                    message: 'not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });
    
    order
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'orders stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err    
        });
    });
    
});

router.get('/:orderId', (req, res, next) =>{
    res.status(200).json({
        message: 'order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) =>{
    res.status(200).json({
        message: 'order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;