import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoute from './routes/user.js';
import authRoute from './routes/auth.js';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import orderRoute from './routes/order.js';
import stripeRoute from './routes/stripe.js';

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: 'shop',
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => console.log(err));

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});
