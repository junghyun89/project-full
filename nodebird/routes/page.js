const express = require('express');
const {
  isLoggedIn,
  isNotLoggedIn,
  isKakao,
  isNotKakao,
} = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCout = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 -  Nodebird' });
});

// router.get('/logout', isNotKakao, (req, res) => {
//   res.render('join', { title: '회원가입 -  Nodebird' });
// });

// router.get('/kakao/logout', isKakao, (req, res) => {
//   res.render('join', { title: '회원가입 -  Nodebird' });
// });

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;
