const request = require('supertest');
const app = require('../app');

// requireAuth is the gate for every authenticated endpoint, so its edge cases
// are pinned here directly rather than only indirectly through home.test.js.
// /api/home is used as the probe because it is currently the only route the
// middleware is mounted in front of (see src/app.js).
describe('requireAuth', () => {
  const validToken = 'mock-token-cust-1002';

  test('calls next() for a valid token and resolves the customerId', async () => {
    const res = await request(app).get('/api/home').set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.customer.customerId).toBe('cust-1002');
  });

  test('returns 401 when the Authorization header is absent', async () => {
    const res = await request(app).get('/api/home');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 for a Bearer prefix with an empty token', async () => {
    const res = await request(app).get('/api/home').set('Authorization', 'Bearer ');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 for the bare scheme with no space or token', async () => {
    const res = await request(app).get('/api/home').set('Authorization', 'Bearer');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  // Deliberate, not accidental: RFC 6750 defines the auth scheme as
  // case-insensitive, but this demo mock matches `Bearer` exactly and treats
  // anything else as malformed -> 401, which the AC's "malformed -> 401" case
  // covers. Pinned here so a future change to the regex is a conscious one.
  test('returns 401 for a lower-case "bearer" scheme (scheme match is case-sensitive by design)', async () => {
    const res = await request(app).get('/api/home').set('Authorization', `bearer ${validToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 when the token is present without the Bearer prefix', async () => {
    const res = await request(app).get('/api/home').set('Authorization', validToken);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  test('returns 401 for an unknown token', async () => {
    const res = await request(app).get('/api/home').set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });
});
