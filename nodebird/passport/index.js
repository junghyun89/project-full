const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    // done(null, user.id);
    done(null, { id: user.id, token: user.accessToken });
  });

  passport.deserializeUser(({ id, token }, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followers',
        },
        {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followings',
        },
      ],
    })
      .then((user) => {
        user.accessToken = token;
        done(null, user);
      })
      .catch((err) => done(err));
  });
};

local();
kakao();

// passport.serializeUser((data, done) => {
//   done(null, { user: data.user.snsId, accessToken: data.accessToken });
// });

// passport.deserializeUser((user, done) => {
//   User.findOne({ where: { id: user.snsId } })
//     .then((data) => {
//       console.log('data', data);
//       const tokenUser = { user: data, accessToken: user.accessToken };
//       done(null, tokenUser);
//     })
//     .catch((err) => done(err));
// });
