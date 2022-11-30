import express from 'express';
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from './verifyToken.js';
import Cart from '../models/Cart.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    return res.status(200).send(cart);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).send(updatedCart);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).send('Cart has been deleted');
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).send(cart);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).send(carts);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
