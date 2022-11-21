import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    const exUser = await User.findOne({ where: { email } });
    if (exUser) return res.status(409).send('User already exists!');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({
      username,
      email,
      password: hashedPassword,
      name,
    });
    return res.status(200).send('User has been created.');
  } catch (error) {
    return res.status(500).send(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).send('User not found!');

    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword)
      return res.status(400).send('Wrong password or username!');

    const token = jwt.sign({ id: user.id }, 'secretkey');
    const { password, ...others } = user;

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logout = (req, res) => {};
