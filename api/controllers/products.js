const mongoose = require('mongoose');
const Product = require('../models/product'); 



exports.get_products_all = (req, res, next) => {
    Product.find()
    .select('price name _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            product: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        //if (docs.length >= 0){
            res.status(200).json(response);
        //} else {
          //  res.status(404).json({
            //    message: "No entries found"
            //});
        //}
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}


exports.create_products_all = (req, res, next) => {
    console.log('file--->>>', req.file);
    const {name, price} = req.body;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price,
        productImage: req.file.path
    });

    product.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'im learning POST request',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err =>  {
        console.log(err);
         res.status(500).json({
             error: err
         });
    });

}

exports.Products_get_all = (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc =>{
        console.log('From database', doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost/products'
                }
            });   
        } else {
            res.status(404).json({
                message: 'no valid id found'
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err})
    })
}

exports.Products_update_all = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps  })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.Products_delete_all = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}