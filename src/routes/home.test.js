const request = require('supertest');
const app = require('../app');

describe('GET /api/home', () => {
  const validToken = 'mock-token-cust-1002';

  const expectedBody = {
    customer: {
      customerId: 'cust-1002',
      firstName: 'Bankuser',
      lastName: 'One',
      phoneNumber: '+1-647-555-0198',
      authProvider: 'Okta',
    },
    accounts: [
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
    recentTransactions: [
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

  test('returns 200 with the full HomeResponse body for a valid token', async () => {
    const res = await request(app).get('/api/home').set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedBody);
    expect(res.body.accounts).toHaveLength(4);
  });

  test('the credit card account has the expected negative balance and availableBalance', async () => {
    const res = await request(app).get('/api/home').set('Authorization', `Bearer ${validToken}`);

    const creditCard = res.body.accounts.find((account) => account.accountId === 'acct-13');
    expect(creditCard).toMatchObject({
      type: 'CREDIT',
      balance: -243.1,
      availableBalance: 4756.9,
    });
  });

  test('the first recent transaction is txn-105 Toronto Hydro', async () => {
    const res = await request(app).get('/api/home').set('Authorization', `Bearer ${validToken}`);

    expect(res.body.recentTransactions[0]).toEqual({
      transactionId: 'txn-105',
      description: 'Toronto Hydro',
      amount: -148.22,
      postedDate: '2024-05-20',
    });
  });

  test('returns 401 with no Authorization header', async () => {
    const res = await request(app).get('/api/home');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 for a malformed Authorization header (missing Bearer prefix)', async () => {
    const res = await request(app).get('/api/home').set('Authorization', validToken);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 for an unknown/garbage token', async () => {
    const res = await request(app).get('/api/home').set('Authorization', 'Bearer garbage-token');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });
});
