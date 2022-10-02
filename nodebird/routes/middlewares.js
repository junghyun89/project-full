const passport = require('passport');
const User = require('../models/user');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

exports.isKakao = (req, res, next) => {
  if (req.user.dataValues.provider === 'kakao') {
    console.log('kakao');
    next();
  }
};

exports.isNotKakao = (req, res, next) => {
  if (req.user.dataValues.provider === 'local') {
    console.log('local');
    next();
  }
};
