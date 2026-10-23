import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, api, registerUser } from './helpers.js';

let server;
let request;

before(async () => {
  server = await startServer('memberships');
  request = api(server.baseUrl);
});

after(() => server.close());

test('a new reader starts on the free tier', async () => {
  const user = await registerUser(request);
  const res = await request('GET', '/api/memberships/me', { token: user.accessToken });
  assert.equal(res.status, 200);
  const tier = res.json.data.membership?.tier ?? res.json.data.tier;
  assert.equal(tier, 'FREE');
});

test('demo membership works locally while Stripe is off', async () => {
  const user = await registerUser(request);
  const res = await request('POST', '/api/memberships/demo-subscribe', { token: user.accessToken });
  assert.equal(res.status, 200);
  assert.equal(res.json.data.membership.tier, 'MEMBER');
  assert.equal(res.json.data.isDemo, true);
});

test('the webhook answers 503 when Stripe is not set up', async () => {
  const res = await request('POST', '/api/memberships/webhook', { body: '{}' });
  assert.equal(res.status, 503);
});
