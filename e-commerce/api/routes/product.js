import express from 'express';
import Product from '../models/Product.js';
import { verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).send(updatedProduct);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).send('Product has been deleted');
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    return res.status(200).send(products);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
