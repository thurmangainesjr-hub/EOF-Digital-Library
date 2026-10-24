import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getSecret } from '../src/lib/secrets.js';

const saved = { ...process.env };
afterEach(() => { process.env = { ...saved }; });

test('a set secret is returned', () => {
  process.env.MY_SECRET = 'value';
  assert.equal(getSecret('MY_SECRET', 'fallback'), 'value');
});

test('outside production a missing secret uses the fallback', () => {
  delete process.env.MY_SECRET;
  process.env.NODE_ENV = 'development';
  assert.equal(getSecret('MY_SECRET', 'fallback'), 'fallback');
});

test('in production a missing secret stops the server', () => {
  delete process.env.MY_SECRET;
  process.env.NODE_ENV = 'production';
  assert.throws(() => getSecret('MY_SECRET', 'fallback'), /MY_SECRET must be set in production/);
});
