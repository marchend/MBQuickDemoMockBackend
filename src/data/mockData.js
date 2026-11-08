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

// Keyed by customerId so the home route can look up everything for a
// given authenticated customer without hardcoding any response data.
const customers = {
  'cust-1002': {
    customerId: 'cust-1002',
    firstName: 'Bankuser',
    lastName: 'One',
    phoneNumber: '+1-647-555-0198',
    authProvider: 'Okta',
  },
};

// Keyed by customerId; each value is the ordered list of accounts for
// that customer (the contract requires this exact array order).
const accountsByCustomerId = {
  'cust-1002': [
    {
      accountId: 'acct-11',
      name: 'Everyday Chequing',
      type: 'CHEQUING',
      maskedNumber: '3310',
      balance: 1542.88,
      availableBalance: 1542.88,
      currencyCode: 'USD',
    },
    {
      accountId: 'acct-12',
      name: 'Rainy Day Savings',
      type: 'SAVINGS',
      maskedNumber: '7765',
      balance: 6120.0,
      availableBalance: 6120.0,
      currencyCode: 'USD',
    },
    {
      accountId: 'acct-13',
      name: 'Cashback Mastercard',
      type: 'CREDIT',
      maskedNumber: '4490',
      balance: -243.1,
      availableBalance: 4756.9,
      currencyCode: 'USD',
    },
    {
      accountId: 'acct-14',
      name: 'TFSA Investment',
      type: 'INVESTMENT',
      maskedNumber: '8821',
      balance: 23410.55,
      availableBalance: 23410.55,
      currencyCode: 'USD',
    },
  ],
};

// Keyed by customerId; each value is the ordered list of recent
// transactions for that customer (most recent first, per the contract).
const transactionsByCustomerId = {
  'cust-1002': [
    {
      transactionId: 'txn-105',
      description: 'Toronto Hydro',
      amount: -148.22,
      postedDate: '2024-05-20',
    },
    {
      transactionId: 'txn-104',
      description: 'Payroll - Acme Corp',
      amount: 2750.0,
      postedDate: '2024-05-17',
    },
    {
      transactionId: 'txn-103',
      description: 'Loblaws',
      amount: -86.43,
      postedDate: '2024-05-15',
    },
    {
      transactionId: 'txn-102',
      description: 'Tim Hortons',
      amount: -4.75,
      postedDate: '2024-05-14',
    },
    {
      transactionId: 'txn-101',
      description: 'Transfer to Savings',
      amount: -500.0,
      postedDate: '2024-05-10',
    },
  ],
};

module.exports = { users, customers, accountsByCustomerId, transactionsByCustomerId };
