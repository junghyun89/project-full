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
            const tokenUser = {
              user: exUser,
              accessToken: accessToken || '',
            };
            done(null, {
              id: tokenUser.user.id,
              accessToken: tokenUser.accessToken,
            });
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.profile_nickname,
              snsId: profile.id,
              provider: 'kakao',
            });
            console.log(newUser.nick);
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
