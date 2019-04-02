const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
// Routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling
app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
          message: error.message
      }
   });
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

module.exports = app;