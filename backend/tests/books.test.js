import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, api, registerUser, login } from './helpers.js';

let server;
let request;

before(async () => {
  server = await startServer('books');
  request = api(server.baseUrl);
});

after(() => server.close());

// Turn a new reader into a creator; the role is in the token, so log in again
async function makeCreator() {
  const user = await registerUser(request, 'author');
  const res = await request('POST', '/api/creators/profile', {
    token: user.accessToken,
    body: { bio: 'Writes books' }
  });
  assert.equal(res.status, 201, res.text);
  const fresh = await login(request, user.email, user.password);
  return { ...user, accessToken: fresh.accessToken };
}

test('the catalog lists books for anyone', async () => {
  const res = await request('GET', '/api/products');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.json.data.products));
});

test('a reader cannot publish a book', async () => {
  const reader = await registerUser(request);
  const res = await request('POST', '/api/products', {
    token: reader.accessToken,
    body: { title: 'Not Allowed' }
  });
  assert.equal(res.status, 403);
});

test('a creator can add a book, and it stays hidden until published', async () => {
  const creator = await makeCreator();
  const created = await request('POST', '/api/products', {
    token: creator.accessToken,
    body: { title: 'The Test Book', description: 'A story', price: 4.99 }
  });
  assert.equal(created.status, 201, created.text);
  const book = created.json.data.product;
  assert.equal(book.title, 'The Test Book');
  assert.equal(book.status, 'DRAFT');
  assert.match(book.author, /^author \d+$/, 'author defaults to the creator name');

  const fetched = await request('GET', `/api/products/${book.slug}`);
  assert.equal(fetched.status, 404, 'drafts are not public');
});

test('the creators list loads', async () => {
  const res = await request('GET', '/api/creators');
  assert.equal(res.status, 200, res.text);
  assert.ok(Array.isArray(res.json.data.creators));
});

test('another creator cannot delete someone else\'s book', async () => {
  const owner = await makeCreator();
  const other = await makeCreator();
  const created = await request('POST', '/api/products', {
    token: owner.accessToken,
    body: { title: 'Mine' }
  });
  assert.equal(created.status, 201, created.text);

  const res = await request('DELETE', `/api/products/${created.json.data.product.id}`, {
    token: other.accessToken
  });
  assert.notEqual(res.status, 200);
});
