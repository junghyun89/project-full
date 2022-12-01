import express from 'express';
import stripe from 'stripe';

stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/payment', (req, res) => {
  stripe.ChargesResource.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: 'usd',
  }, (stripeErr, stripeRes) => {
    if (stripeErr) return res.status(500).send(stripeErr)
    res.status(200).send(stripeRes)
  });
});

export default router;
