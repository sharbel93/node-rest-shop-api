const express = require('express');
const router = express.Router();

// Handle incoming GET requests to /products
router.get('/', (req, res, next) => {
    res.status(200).json({
       message: 'Handling GET  requests to /products'
    });
});

// Handle incoming POST requests to /products
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST  requests to /products',
        createdProduct: product
    });
});

// Handle incoming GET requests to specific product id /:productsID
router.get('/:productId', (req, res, next) => {
   const id = req.params.productId;
   if(id === 'special'){
       res.status(200).json({
           message: 'You discovered the special ID',
           id: id
       });
   } else {
       res.status(200).json({
          message: 'You passed an ID'
       });
   }
});

// Handle incoming PATCH requests to specific product id /:productID
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    });
});
// Handle incoming DELETE requests to specific product id /:productID
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});
module.exports = router;