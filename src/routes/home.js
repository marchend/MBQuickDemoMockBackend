const express = require('express');
const { customers, accountsByCustomerId, transactionsByCustomerId } = require('../data/mockData');

const router = express.Router();

// GET / is mounted at /api/home behind requireAuth (see src/app.js), which
// attaches req.customerId. Everything in the response is looked up from
// mockData.js keyed by that customerId -- nothing here is hardcoded.
router.get('/', (req, res) => {
  const { customerId } = req;

  const customer = customers[customerId];
  const accounts = accountsByCustomerId[customerId] || [];
  const recentTransactions = transactionsByCustomerId[customerId] || [];

  if (!customer) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({
    customer,
    accounts,
    recentTransactions,
  });
});

module.exports = router;
