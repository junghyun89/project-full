import Post from '../models/post.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    let ids = [];
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      ids.push(userInfo.id);
      const user = await User.findOne({
        where: { id: userInfo.id },
        include: { model: User, attributes: ['id'], as: 'Followeds' },
      });
      user.Followeds.map((el) => ids.push(el.dataValues.id));
      ids = userId ? userId : ids;
      let posts = await Post.findAll({
        where: { UserId: ids },
        include: {
          model: User,
          attributes: ['id', 'profilePic', 'name'],
        },
        order: [['createdAt', 'DESC']],
      });
      posts = posts.map((el) => el.get({ plain: true }));
      return res.status(200).send(posts);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const addPost = async (req, res) => {
  try {
    const { desc, img } = req.body;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      await Post.create({
        desc,
        img,
        UserId: userInfo.id,
        // createdAt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      });
      return res.status(200).send('Post has been created');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const post = await Post.findOne({
        where: { id: req.params.id, UserId: userInfo.id },
      });
      await post.destroy()
      return res.status(200).send('Post has been deleted');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
