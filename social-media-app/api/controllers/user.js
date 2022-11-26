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
    console.log('----------');
    const { name, city, website, profilePic, coverPic } = req.body;
    console.log('----body', req.body);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      console.log('--info', userInfo);
      const user = await User.findOne({ where: { id: userInfo.id } });
      console.log('---user', user);
      await user.update({
        name: name[0],
        city: city[0],
        website: website[0],
        coverPic,
        profilePic,
      });
      return res.status(200).send('Updated!');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
