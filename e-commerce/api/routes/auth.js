import express from 'express';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.PASS_SEC
  ).toString();
  try {
    const newUser = await User.create({
      username,
      email,
      password: encryptedPassword,
    });
    return res.status(201).send(newUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).send('User not found!');
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (userPassword !== req.body.password)
      return res.status(401).send('Incorrect password!');
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );
    const { password, ...others } = user._doc;
    res.status(200).send({ ...others, accessToken });
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
