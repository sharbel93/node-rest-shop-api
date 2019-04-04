const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    Product.find().select("name price _id").exec().then(
        docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc._id
                        }
                    }
                })
            };

            // if(ds.products.length >= 0){
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }
        }).catch(
            err => {
                res.status(500).json({
                    error:err
                })
            }
    );

});

// Handle incoming POST requests to /products
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });


});

// Handle incoming GET requests to specific product id /:productsID
router.get('/:productId', (req, res, next) => {
   const id = req.params.productId;
   Product.findById(id)
       .select('name price _id')
       .exec()
       .then(doc => {
           if(doc){
           res.status(200).json({
               product: doc,
               request: {
                   type: 'GET',
                   url: 'http://localhost:4000/products'
               }
           });
           } else {
               res.status(404).json({message: 'No Valid entry found for provided ID'});
           }
       }).catch(err => {
       res.status(500).json({error: err});
   })
});

// Handle incoming PATCH requests to specific product id /:productID
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of Object.keys(req.body)){
        updateOps[ops] = req.body[ops];
    }
    Product.update({ _id: id}, {$set: updateOps}).exec().then(() => {
        res.status(200).json(
        {
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/products/' + id
            }
        }
        );
    }).catch(
        err => {
            res.status(500).json({ error: err});
        }
    );

});
// Handle incoming DELETE requests to specific product id /:productID
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(
        result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:4000/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        }).catch(
            err => {
                res.status(500).json({
                    error: err
                })
            }
    );
});
module.exports = router;