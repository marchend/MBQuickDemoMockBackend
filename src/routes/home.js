const express = require('express');
const { customers, accountsByCustomerId, transactionsByCustomerId } = require('../data/mockData');

const router = express.Router();

// GET / is mounted at /api/home behind requireAuth (see src/app.js), which
// attaches req.customerId. Everything in the response is looked up from
// mockData.js keyed by that customerId -- nothing here is hardcoded.
router.get('/', (req, res) => {
  const { customerId } = req;

  const customer = customers[customerId];
  const accounts = accountsByCustomerId[customerId];
  const recentTransactions = transactionsByCustomerId[customerId];

  // requireAuth has already matched the bearer token against mockData.users
  // and set req.customerId, so any missing fixture here means a user exists
  // in `users` with no matching customers/accounts/transactions entry -- an
  // inconsistency in our own fixture data, not a client auth problem. A 401
  // would report that as "your token is bad" and send clients debugging a
  // token that is actually fine, and `|| []` fallbacks would hide it behind
  // a valid-looking empty landing screen. Fail loudly instead; the AC only
  // requires 401 for *token* failures.
  if (!customer || !accounts || !recentTransactions) {
    return res.status(500).json({ error: 'Internal server error.' });
  }

  return res.status(200).json({
    customer,
    accounts,
    recentTransactions,
  });
});

module.exports = router;
