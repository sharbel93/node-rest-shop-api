const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    Product.find().exec().then(
        docs => {
            console.log(docs);
            const ds = { products: docs };
            console.log(ds.products.length);
            // if(ds.products.length >= 0){
            res.status(200).json(ds);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }
        }).catch(
            err => {
                console.log(err);
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
        console.log(result);
        res.status(201).json({
            message: 'Handling POST  requests to /products',
            createdProduct: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


});

// Handle incoming GET requests to specific product id /:productsID
router.get('/:productId', (req, res, next) => {
   const id = req.params.productId;
   Product.findById(id)
       .exec()
       .then(doc => {
           console.log('from database',doc);
           if(doc){
           res.status(200).json(doc);
           } else {
               res.status(404).json({message: 'No Valid entry found for provided ID'});
           }
       }).catch(err => {
       console.log(err);
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
    Product.update({ _id: id}, {$set: updateOps}).exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(
        err => {
            console.log(err);
            res.status(500).json({ error: err});
        }
    );

});
// Handle incoming DELETE requests to specific product id /:productID
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(
        result => {
            res.status(200).json(result);
        }).catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
    );
});
module.exports = router;