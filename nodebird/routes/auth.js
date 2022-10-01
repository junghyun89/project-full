const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');

const {
  isLoggedIn,
  isNotLoggedIn,
  isNotKakao,
  isKakao,
} = require('./middlewares');
const User = require('../models/user');
const { request } = require('express');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', isLoggedIn, isNotKakao, (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/');
  });
});

router.get('/kakao/logout', isKakao, async (req, res) => {
  try {
    // const ACCESS_TOKEN = res.user.dataValue.accessToken;
    const REDIRECT_URI = '/auth/kakao/logout';
    let logout = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/user/logout',
      data: {
        client_id: process.env.KAKAO_ID,
        logout_redirect_uri: REDIRECT_URI,
      },
    }).then(
      req.logout(() => {
        req.session.destroy();
        res.redirect('/');
      })
    );
    console.log('link', logout);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

module.exports = router;
