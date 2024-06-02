const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { models } = require('../models');
const bcrypt = require('bcrypt');
const { first } = require('lodash');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/api/v1/auths/google/callback', // Change this
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await models.User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (!user) {
        user = await models.User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos[0].value,
          username: profile.emails[0].value,
          email: profile.emails[0].value,
          password: bcrypt.hashSync('abc', 10)
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8000/api/v1/auths/facebook/callback',
  profileFields: ['id', 'email', 'name', 'photos']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile, "profile"); // Log toàn bộ profile để kiểm tra
    const username = `user_${profile.id}`;
    const email = `${username}@facebook.com`; // Tạo email tạm thời dựa trên ID Facebook

    let user = await models.User.findOne({
      where: { email: email }
    });

    if (!user) {
      user = await models.User.create({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value,
        username: username,
        email: email,
        password: bcrypt.hashSync('abc', 10) // Bạn nên thay đổi mật khẩu mặc định
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
