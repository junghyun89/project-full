require('dotenv').config();
require('express-async-errors');

// async errors

const express = require('express');
const app = express();

const connectDB = require('./src/db/connect');
const productsRouter = require('./src/routes/products');

const notFoundMiddleware = require('./src/middleware/not-found');
const errorMiddleware = require('./src/middleware/error-handler');

//middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter);

//products route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};
start();
