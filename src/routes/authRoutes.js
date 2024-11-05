const express = require('express');
const passport = require('passport');
const router = express.Router();


// Rota para logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/'); // Redireciona após o logout
  });
});

module.exports = router;
