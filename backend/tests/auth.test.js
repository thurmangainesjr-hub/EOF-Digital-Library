import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, api, registerUser } from './helpers.js';

let server;
let request;

before(async () => {
  server = await startServer('auth');
  request = api(server.baseUrl);
});

after(() => server.close());

test('health check answers', async () => {
  const res = await request('GET', '/health');
  assert.equal(res.status, 200);
  assert.equal(res.json.status, 'ok');
});

test('a reader can register and gets tokens without the password hash', async () => {
  const user = await registerUser(request);
  assert.ok(user.accessToken);
  assert.ok(user.refreshToken);
  assert.equal(user.user.passwordHash, undefined);
  assert.equal(user.user.role, 'READER');
});

test('registering the same email twice is refused', async () => {
  const user = await registerUser(request);
  const res = await request('POST', '/api/auth/register', {
    body: { email: user.email, password: 'Password123!', displayName: 'Again' }
  });
  assert.equal(res.status, 400);
});

test('a short password is refused', async () => {
  const res = await request('POST', '/api/auth/register', {
    body: { email: 'short@example.com', password: 'abc', displayName: 'Shorty' }
  });
  assert.equal(res.status, 400);
});

test('login works with the right password and fails with the wrong one', async () => {
  const user = await registerUser(request);

  const ok = await request('POST', '/api/auth/login', {
    body: { email: user.email, password: user.password }
  });
  assert.equal(ok.status, 200);
  assert.ok(ok.json.data.accessToken);

  const bad = await request('POST', '/api/auth/login', {
    body: { email: user.email, password: 'WrongPassword1!' }
  });
  assert.equal(bad.status, 401);
});

test('protected routes need a valid token', async () => {
  const none = await request('GET', '/api/memberships/me');
  assert.equal(none.status, 401);

  const forged = await request('GET', '/api/memberships/me', { token: 'not-a-real-token' });
  assert.equal(forged.status, 401);
});

test('a refresh token gives a new access token', async () => {
  const user = await registerUser(request);
  const res = await request('POST', '/api/auth/refresh', { body: { refreshToken: user.refreshToken } });
  assert.equal(res.status, 200);
  assert.ok(res.json.data.accessToken);
});
