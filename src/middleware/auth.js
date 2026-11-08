const { users } = require('../data/mockData');

// Demo-only bearer token check. Tokens are static, opaque strings issued by
// POST /api/login (see src/routes/auth.js) and resolved here against the
// same mockData.users fixture. No real token validation (no expiry, no
// signature) -- this is intentionally out of scope for the demo mock.
function requireAuth(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  // The scheme match is deliberately case-sensitive and a `Bearer ` prefix
  // with an empty token is deliberately rejected: both fall under the AC's
  // "malformed -> 401". This knowingly deviates from RFC 6750, which defines
  // the scheme as case-insensitive. Both behaviours are pinned by name in
  // src/middleware/auth.test.js so changing them stays a conscious decision.
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
