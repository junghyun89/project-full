import express from 'express';
import Order from '../models/Order.js';
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from './verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.status(200).send(order);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).send(updatedOrder);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).send('Order has been deleted');
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findOne({ userId: req.params.userId });
    return res.status(200).send(orders);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).send(orders);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
      { $group: { _id: '$month', total: { $sum: '$sales' } } },
    ]);
    return res.status(200).send(income);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
