// Single source of truth for demo user fixture data.
// Intentionally the ONLY place demo data lives, so later stories
// (e.g. the Landing Screen API) can extend this file without
// touching auth logic.
const users = [
  {
    username: 'bankuser.one@acmebank.com',
    password: 'Password123',
    customerId: 'cust-1002',
    firstName: 'Bankuser',
    token: 'mock-token-cust-1002',
  },
];

module.exports = { users };
