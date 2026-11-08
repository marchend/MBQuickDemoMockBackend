const { users } = require('../data/mockData');

// Demo-only bearer token check. Tokens are static, opaque strings issued by
// POST /api/login (see src/routes/auth.js) and resolved here against the
// same mockData.users fixture. No real token validation (no expiry, no
// signature) -- this is intentionally out of scope for the demo mock.
function requireAuth(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const match = /^Bearer (.+)$/.exec(authHeader);

  if (!match) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = match[1];
  const matchedUser = users.find((user) => user.token === token);

  if (!matchedUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.customerId = matchedUser.customerId;

  return next();
}

module.exports = { requireAuth };
