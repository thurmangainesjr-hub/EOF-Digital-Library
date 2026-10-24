import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { startServer, api, registerUser } from './helpers.js';

const WEBHOOK_SECRET = 'whsec_test_secret';
let server;
let request;

before(async () => {
  // A fake key is enough: these tests never call Stripe's servers
  server = await startServer('stripe', {
    STRIPE_SECRET_KEY: 'sk_test_fake',
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET
  });
  request = api(server.baseUrl);
});

after(() => server.close());

function signedEvent(type) {
  const payload = JSON.stringify({ id: 'evt_test', object: 'event', type, data: { object: {} } });
  const header = new Stripe('sk_test_fake').webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  return { payload, header };
}

test('a correctly signed Stripe webhook is accepted', async () => {
  const { payload, header } = signedEvent('ping.test');
  const res = await request('POST', '/api/memberships/webhook', {
    body: payload,
    headers: { 'stripe-signature': header }
  });
  assert.equal(res.status, 200, res.text);
  assert.equal(res.json.received, true);
});

test('a webhook with a bad signature is rejected', async () => {
  const { payload } = signedEvent('ping.test');
  const res = await request('POST', '/api/memberships/webhook', {
    body: payload,
    headers: { 'stripe-signature': 't=1,v1=bad' }
  });
  assert.equal(res.status, 400);
});

test('free demo membership is blocked once Stripe is set up', async () => {
  const user = await registerUser(request);
  const res = await request('POST', '/api/memberships/demo-subscribe', { token: user.accessToken });
  assert.equal(res.status, 403);
});
