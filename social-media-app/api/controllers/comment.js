import jwt from 'jsonwebtoken';
import Comment from '../models/comment.js';
import User from '../models/user.js';

export const getComments = async (req, res) => {
  try {
    let comments = await Comment.findAll({
      where: { PostId: req.query.postId },
      include: {
        model: User,
        attributes: ['id', 'profilePic', 'name'],
      },
      order: [['createdAt', 'DESC']],
    });
    comments = comments.map((el) => el.get({ plain: true }));
    console.log(comments);
    return res.status(200).send(comments);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { desc, postId } = req.body;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send('Not logged in!');

    jwt.verify(token, 'secretKey', async (err, userInfo) => {
      if (err) return res.status(403).send('Token is not valid!');
      await Comment.create({
        desc,
        UserId: userInfo.id,
        PostId: postId,
      });
      return res.status(200).send('Comment has been created.');
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
