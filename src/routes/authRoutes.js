const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota de login com o Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Aqui você define os escopos que deseja
}));

// Callback que o Google irá redirecionar após a autenticação
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login' // Redireciona em caso de falha
}), (req, res) => {
  // Autenticação bem-sucedida, redirecione para onde você desejar
  res.redirect('/HomePage');
});

// Rota para logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/'); // Redireciona após o logout
  });
});

module.exports = router;
