import jwt from 'jsonwebtoken';
import Post from '../models/post.js';
import User from '../models/user.js';

export const getLikes = async (req, res) => {
  try {
    console.log('---------------');
    const post = await Post.findAll({
      where: { id: req.query.postId },
      include: { model: User, through: { attributes: ['likes'] } },
    });
    console.log(post.getUsers());
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
};
