import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, api, registerUser, login } from './helpers.js';

let server;
let request;

before(async () => {
  server = await startServer('adaptations');
  request = api(server.baseUrl);
});

after(() => server.close());

async function makeCreator() {
  const user = await registerUser(request, 'author');
  const res = await request('POST', '/api/creators/profile', { token: user.accessToken, body: {} });
  assert.equal(res.status, 201, res.text);
  const fresh = await login(request, user.email, user.password);
  return { ...user, accessToken: fresh.accessToken };
}

// Membership tier is in the token, so log in again after subscribing
async function makeMember() {
  const user = await registerUser(request);
  const res = await request('POST', '/api/memberships/demo-subscribe', { token: user.accessToken });
  assert.equal(res.status, 200, res.text);
  const fresh = await login(request, user.email, user.password);
  return { ...user, accessToken: fresh.accessToken };
}

async function addBook(creator, adaptationAllowed) {
  const res = await request('POST', '/api/products', {
    token: creator.accessToken,
    body: { title: `Book ${Date.now()}`, adaptationAllowed }
  });
  assert.equal(res.status, 201, res.text);
  return res.json.data.product;
}

test('a free reader cannot ask to adapt a book', async () => {
  const creator = await makeCreator();
  const book = await addBook(creator, true);
  const reader = await registerUser(request);
  const res = await request('POST', '/api/adaptations/request', {
    token: reader.accessToken,
    body: { productId: book.id, targetFormat: 'Film Script' }
  });
  assert.equal(res.status, 403);
});

test('adaptation is refused when the author has not allowed it', async () => {
  const creator = await makeCreator();
  const book = await addBook(creator, false);
  const member = await makeMember();
  const res = await request('POST', '/api/adaptations/request', {
    token: member.accessToken,
    body: { productId: book.id, targetFormat: 'Film Script' }
  });
  assert.equal(res.status, 400);
});

test('a member can request an adaptation and the author can approve it', async () => {
  const creator = await makeCreator();
  const book = await addBook(creator, true);
  const member = await makeMember();

  const asked = await request('POST', '/api/adaptations/request', {
    token: member.accessToken,
    body: { productId: book.id, targetFormat: 'Film Script', notes: 'Feature film' }
  });
  assert.equal(asked.status, 201, asked.text);
  const requestId = asked.json.data.request.id;
  assert.equal(asked.json.data.request.status, 'PENDING');

  const again = await request('POST', '/api/adaptations/request', {
    token: member.accessToken,
    body: { productId: book.id, targetFormat: 'Film Script' }
  });
  assert.equal(again.status, 400, 'only one open request per book');

  const approved = await request('PUT', `/api/adaptations/requests/${requestId}`, {
    token: creator.accessToken,
    body: { status: 'APPROVED', reviewNotes: 'Go ahead' }
  });
  assert.equal(approved.status, 200, approved.text);
  assert.equal(approved.json.data.request.status, 'APPROVED');
});

test('only the book\'s author can approve its adaptation', async () => {
  const creator = await makeCreator();
  const stranger = await makeCreator();
  const book = await addBook(creator, true);
  const member = await makeMember();
  const asked = await request('POST', '/api/adaptations/request', {
    token: member.accessToken,
    body: { productId: book.id, targetFormat: 'TV Series' }
  });
  assert.equal(asked.status, 201, asked.text);

  const res = await request('PUT', `/api/adaptations/requests/${asked.json.data.request.id}`, {
    token: stranger.accessToken,
    body: { status: 'APPROVED' }
  });
  assert.equal(res.status, 404);
});
