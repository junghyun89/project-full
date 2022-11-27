import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ where: { id: userId }, raw: true });
    const { password, ...info } = user;
    return res.status(200).send(info);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, city, website, profilePic, coverPic } = req.body;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const user = await User.findOne({ where: { id: userInfo.id } });
      await user.update({
        name,
        city,
        website,
        coverPic,
        profilePic,
      });
      const { password, ...others } = user.dataValues;
      return res.status(200).send(others);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
