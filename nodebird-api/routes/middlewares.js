const jwt = require('jsonwebtoken');
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

exports.verifyToken = (req, res, next) => {
  try {
    req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // verify(토큰, 비밀키)
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
};
