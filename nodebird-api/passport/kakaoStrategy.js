const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            exUser.accessToken = accessToken;
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.username,
              snsId: profile.id,
              provider: 'kakao',
              accessToken: accessToken,
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
