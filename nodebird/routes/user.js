const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing, deleteFollowing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing);

router.delete('/:id/follow', isLoggedIn, deleteFollowing);

router.post('/profile', async (req, res, next) => {
  try {
    await User.update({ nick: req.body.nick }, { where: { id: req.user.id } });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
