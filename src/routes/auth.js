const express = require('express');
const { users } = require('../data/mockData');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  const trimmedUsername = typeof username === 'string' ? username.trim() : '';
  const hasPassword = typeof password === 'string' && password.length > 0;

  if (!trimmedUsername || !hasPassword) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const matchedUser = users.find(
    (user) =>
      user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
      user.password === password
  );

  if (!matchedUser) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  return res.status(200).json({
    token: matchedUser.token,
    customerId: matchedUser.customerId,
    firstName: matchedUser.firstName,
  });
});

module.exports = router;
