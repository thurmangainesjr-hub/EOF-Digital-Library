/**
 * Test helpers
 *
 * Each test file gets its own throwaway SQLite database and its own server
 * on a free port, so files can run side by side.
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function startServer(name, extraEnv = {}) {
  Object.assign(process.env, {
    NODE_ENV: 'test',
    DATABASE_URL: `file:./test-${name}.db`,
    JWT_SECRET: 'test-access-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    STRIPE_SECRET_KEY: '',
    STRIPE_WEBHOOK_SECRET: '',
    ...extraEnv
  });

  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: backendDir,
    env: process.env,
    stdio: 'ignore'
  });

  const { default: app } = await import('../src/index.js');
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return {
    baseUrl,
    close: () => new Promise(resolve => server.close(resolve))
  };
}

export function api(baseUrl) {
  return async function request(method, url, { body, token, headers = {} } = {}) {
    const res = await fetch(baseUrl + url, {
      method,
      headers: {
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body))
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = undefined; }
    return { status: res.status, json, text };
  };
}

let counter = 0;

// Register a new reader and return their tokens
export async function registerUser(request, prefix = 'reader') {
  counter += 1;
  const email = `${prefix}${counter}-${Date.now()}@example.com`;
  const password = 'Password123!';
  const res = await request('POST', '/api/auth/register', {
    body: { email, password, displayName: `${prefix} ${counter}` }
  });
  if (res.status !== 201) throw new Error(`register failed: ${res.status} ${res.text}`);
  return { email, password, ...res.json.data };
}

export async function login(request, email, password) {
  const res = await request('POST', '/api/auth/login', { body: { email, password } });
  if (res.status !== 200) throw new Error(`login failed: ${res.status} ${res.text}`);
  return res.json.data;
}
