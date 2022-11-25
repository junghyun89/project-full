import Post from '../models/post.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const getLikes = async (req, res) => {
  try {
    let post = await Post.findOne({
      where: { id: req.query.postId },
      include: { model: User, as: 'liker', attributes: ['id'] },
    });
    const likers = post.liker.map((el) => el.id);
    return res.status(200).send(likers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const addLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const post = await Post.findOne({ where: { id: req.body.postId } });
      await post.addLiker(userInfo.id);
      return res.status(200).send('Post has been liked.');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteLike = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      const post = await Post.findOne({
        where: { id: req.query.postId },
      });
      await post.removeLiker(userInfo.id);
      return res.status(200).send('Post has been disliked.');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
