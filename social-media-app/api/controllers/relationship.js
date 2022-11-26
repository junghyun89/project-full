import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const getRelationships = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.query.followedUserId },
      include: { model: User, as: 'Followers', attributes: ['id'] },
    });
    const followers = user.Followers.map((el) => el.id);
    return res.status(200).send(followers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const addRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const user = await User.findOne({
        where: { id: req.query.userId },
      });
      console.log('-----?', user);
      await user.addFollowers(userInfo.id);
      return res.status(200).send('Following');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const user = await User.findOne({
        where: { id: req.query.userId },
      });
      // console.log('-----?', user.Followeds);
      await user.removeFollowers(userInfo.id);
      return res.status(200).send('Unfollow');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
