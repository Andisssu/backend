// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Ajuste o caminho para o seu modelo de usuário

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Coloque seu Client ID aqui
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Coloque seu Client Secret aqui
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifique se o usuário já existe no banco de dados
    let existingUser = await User.findOne({ where: { googleId: profile.id } });

    if (existingUser) {
      // Usuário já existe
      done(null, existingUser);
    } else {
      // Se não existir, crie um novo usuário
      const newUser = await User.create({
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.emails[0].value,
        // Adicione outros campos conforme necessário
      });
      done(null, newUser);
    }
  } catch (err) {
    console.error(err);
    done(err, null);
  }
}));

// Serializar o usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar o usuário
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    });
});
