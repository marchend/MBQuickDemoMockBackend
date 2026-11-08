const request = require('supertest');
const app = require('../app');

describe('POST /api/login', () => {
  const validUsername = 'bankuser.one@acmebank.com';
  const validPassword = 'Password123';
  const successPayload = {
    token: 'mock-token-cust-1002',
    customerId: 'cust-1002',
    firstName: 'Bankuser',
  };

  test('returns 200 with token/customerId/firstName for valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: validUsername, password: validPassword });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(successPayload);
  });

  test('returns 200 for an upper-case username variant (case-insensitive match)', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'BANKUSER.ONE@ACMEBANK.COM', password: validPassword });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(successPayload);
  });

  test('returns 200 for a username with surrounding whitespace', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: `  ${validUsername}  `, password: validPassword });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(successPayload);
  });

  test('returns 400 for a whitespace-only username', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: '   ', password: validPassword });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password are required.' });
  });

  test('returns 401 when the password has surrounding whitespace (password is not trimmed)', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: validUsername, password: ` ${validPassword} ` });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Incorrect username or password.' });
  });

  test('returns 401 for a valid username with the wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: validUsername, password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Incorrect username or password.' });
  });

  test('returns 401 for an unknown username', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'nobody@acmebank.com', password: validPassword });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Incorrect username or password.' });
  });

  test('returns 400 when username is missing', async () => {
    const res = await request(app).post('/api/login').send({ password: validPassword });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password are required.' });
  });

  test('returns 400 when password is missing', async () => {
    const res = await request(app).post('/api/login').send({ username: validUsername });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Username and password are required.' });
  });

  test('returns 400 when username or password is an empty string', async () => {
    const resEmptyUsername = await request(app)
      .post('/api/login')
      .send({ username: '', password: validPassword });
    expect(resEmptyUsername.status).toBe(400);
    expect(resEmptyUsername.body).toEqual({ error: 'Username and password are required.' });

    const resEmptyPassword = await request(app)
      .post('/api/login')
      .send({ username: validUsername, password: '' });
    expect(resEmptyPassword.status).toBe(400);
    expect(resEmptyPassword.body).toEqual({ error: 'Username and password are required.' });
  });
});

describe('JSON error contract', () => {
  test('returns a JSON 400 for a malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send('{"username":');

    expect(res.status).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual({ error: 'Malformed JSON request body.' });
  });

  test('returns a JSON 404 for an unmatched route', async () => {
    const res = await request(app)
      .post('/api/logn')
      .send({ username: 'bankuser.one@acmebank.com', password: 'Password123' });

    expect(res.status).toBe(404);
    expect(res.type).toBe('application/json');
    expect(res.body).toEqual({ error: 'Not found.' });
  });
});
