import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { startServer, api, registerUser, login } from './helpers.js';

// Small stand-ins for Griot AI and the Gutenberg catalog, so tests run offline
function startFake(handler) {
  const server = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    const json = body ? JSON.parse(body) : undefined;
    const { status = 200, data } = await handler(req, json);
    res.writeHead(status, { 'content-type': typeof data === 'string' ? 'text/plain' : 'application/json' });
    res.end(typeof data === 'string' ? data : JSON.stringify(data));
  });
  return new Promise(resolve => server.listen(0, () => resolve({
    server,
    url: `http://127.0.0.1:${server.address().port}`
  })));
}

const griotCalls = [];
let griotMode = 'ok'; // ok, demo, down

let griot;
let gutendex;
let server;
let request;

before(async () => {
  griot = await startFake(async (req, body) => {
    if (griotMode === 'down') return { status: 500, data: { error: 'Griot exploded' } };
    griotCalls.push({ path: req.url, body });
    if (req.url === '/api/projects/import-book') {
      return { status: 201, data: { success: true, projectId: `project-${griotCalls.length}` } };
    }
    if (req.url === '/api/chains/adapt') {
      const screenplay = griotMode === 'demo'
        ? 'This is a demo response from Griot AI.\n[Demo Mode Active]'
        : `FADE IN:\nINT. ${body.bookTitle.toUpperCase()} - DAY`;
      return {
        data: {
          success: true,
          data: { outputs: { input: body.content, analysis: 'Characters...', screenplay } }
        }
      };
    }
    return { status: 404, data: { error: 'not found' } };
  });

  gutendex = await startFake(async req => {
    if (req.url === '/books/84') {
      return {
        data: {
          id: 84,
          title: 'Frankenstein',
          authors: [{ name: 'Shelley, Mary' }],
          subjects: ['Horror tales'],
          formats: { 'text/plain; charset=utf-8': `${gutendex.url}/files/84.txt` }
        }
      };
    }
    if (req.url === '/files/84.txt') {
      return { data: 'Header\n*** START OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN ***\nYou will rejoice to hear...\n*** END OF THE PROJECT GUTENBERG EBOOK ***' };
    }
    return { status: 404, data: { detail: 'Not found' } };
  });

  server = await startServer('griot', {
    GRIOT_API_URL: griot.url,
    GUTENDEX_API_URL: gutendex.url
  });
  request = api(server.baseUrl);
});

after(async () => {
  await server.close();
  griot.server.close();
  gutendex.server.close();
});

beforeEach(() => {
  griotCalls.length = 0;
  griotMode = 'ok';
});

// Membership tier is in the token, so log in again after each change
async function subscribe(user) {
  const res = await request('POST', '/api/memberships/demo-subscribe', { token: user.accessToken });
  assert.equal(res.status, 200, res.text);
  const fresh = await login(request, user.email, user.password);
  return { ...user, accessToken: fresh.accessToken };
}

async function makeMember() {
  return subscribe(await registerUser(request));
}

async function makeAuthor() {
  const user = await registerUser(request, 'author');
  const res = await request('POST', '/api/creators/profile', { token: user.accessToken, body: {} });
  assert.equal(res.status, 201, res.text);
  return subscribe(user);
}

async function addBook(author, extra = {}) {
  const res = await request('POST', '/api/products', {
    token: author.accessToken,
    body: { title: `Book ${Date.now()}`, adaptationAllowed: true, ...extra }
  });
  assert.equal(res.status, 201, res.text);
  return res.json.data.product;
}

test('an author sends their own book to Griot and gets a script back', async () => {
  const author = await makeAuthor();
  const book = await addBook(author, { title: 'The Drake Prophecy' });

  const res = await request('POST', `/api/griot/export/${book.id}`, {
    token: author.accessToken,
    body: { adaptationType: 'screenplay', text: 'Chapter 1. The drake woke.' }
  });
  assert.equal(res.status, 200, res.text);
  assert.match(res.json.data.script, /FADE IN:\nINT\. THE DRAKE PROPHECY/);
  assert.equal(res.json.data.isDemo, false);
  assert.equal(res.json.data.status, 'DRAFT');

  // Book in: Griot got a project and the pasted text
  assert.deepEqual(griotCalls.map(c => c.path), ['/api/projects/import-book', '/api/chains/adapt']);
  assert.equal(griotCalls[0].body.sourceBook.title, 'The Drake Prophecy');
  assert.equal(griotCalls[1].body.content, 'Chapter 1. The drake woke.');

  // Script out: it is saved in Library
  const saved = await request('GET', `/api/griot/adaptations/${res.json.data.adaptationId}`, { token: author.accessToken });
  assert.equal(saved.status, 200, saved.text);
  assert.equal(saved.json.data.adaptation.scriptText, res.json.data.script);
  assert.equal(saved.json.data.adaptation.griotProjectId, res.json.data.projectId);

  const list = await request('GET', '/api/griot/my-adaptations', { token: author.accessToken });
  assert.equal(list.status, 200, list.text);
  assert.equal(list.json.data.adaptations.length, 1);
  assert.equal(list.json.data.adaptations[0].scriptText, undefined, 'the list leaves out the script');
});

test('publishing a book does not let other members adapt it', async () => {
  const author = await makeAuthor();
  const book = await addBook(author, { description: 'A drake story' });
  const member = await makeMember();

  const res = await request('POST', `/api/griot/export/${book.id}`, {
    token: member.accessToken,
    body: { adaptationType: 'screenplay', text: 'my own text' }
  });
  assert.equal(res.status, 403);
  assert.equal(griotCalls.length, 0, 'nothing is sent to Griot');
});

test('a member can adapt once the author approves their request', async () => {
  const author = await makeAuthor();
  const book = await addBook(author, { description: 'A drake guards the last egg.' });
  const member = await makeMember();

  const asked = await request('POST', '/api/adaptations/request', {
    token: member.accessToken,
    body: { productId: book.id, targetFormat: 'Film Script' }
  });
  assert.equal(asked.status, 201, asked.text);
  const approved = await request('PUT', `/api/adaptations/requests/${asked.json.data.request.id}`, {
    token: author.accessToken,
    body: { status: 'APPROVED' }
  });
  assert.equal(approved.status, 200, approved.text);

  const res = await request('POST', `/api/griot/export/${book.id}`, {
    token: member.accessToken,
    body: { adaptationType: 'screenplay', text: 'text the member made up' }
  });
  assert.equal(res.status, 200, res.text);
  // Only the author can supply manuscript text; others get the book's own description
  assert.equal(griotCalls[1].body.content, 'A drake guards the last egg.');
});

test('a public domain Gutenberg book can be adapted by any member', async () => {
  const member = await makeMember();

  const res = await request('POST', '/api/griot/export/gutenberg-84', {
    token: member.accessToken,
    body: { adaptationType: 'screenplay' }
  });
  assert.equal(res.status, 200, res.text);
  assert.equal(griotCalls[1].body.content.trim(), 'You will rejoice to hear...');
  assert.match(res.json.data.script, /FRANKENSTEIN/);

  const saved = await request('GET', `/api/griot/adaptations/${res.json.data.adaptationId}`, { token: member.accessToken });
  assert.equal(saved.json.data.adaptation.gutenbergId, '84');
  assert.equal(saved.json.data.adaptation.productId, null);
});

test('sample text from Griot without an AI key is marked as demo', async () => {
  griotMode = 'demo';
  const author = await makeAuthor();
  const book = await addBook(author);

  const res = await request('POST', `/api/griot/export/${book.id}`, {
    token: author.accessToken,
    body: { text: 'Once upon a time' }
  });
  assert.equal(res.status, 200, res.text);
  assert.equal(res.json.data.isDemo, true);
  assert.match(res.json.data.message, /sample text/);
});

test('a clear error when Griot AI is not working', async () => {
  griotMode = 'down';
  const author = await makeAuthor();
  const book = await addBook(author);

  const res = await request('POST', `/api/griot/export/${book.id}`, {
    token: author.accessToken,
    body: { text: 'Once upon a time' }
  });
  assert.equal(res.status, 503);
  assert.match(res.json.error, /Griot exploded/);

  const list = await request('GET', '/api/griot/my-adaptations', { token: author.accessToken });
  assert.equal(list.json.data.adaptations.length, 0, 'nothing is saved when Griot fails');
});

test('a book with no text asks for the manuscript', async () => {
  const author = await makeAuthor();
  const book = await addBook(author);

  const res = await request('POST', `/api/griot/export/${book.id}`, { token: author.accessToken, body: {} });
  assert.equal(res.status, 400);
  assert.match(res.json.error, /Paste the manuscript/);
});

test('people cannot read each other\'s adaptations', async () => {
  const author = await makeAuthor();
  const book = await addBook(author);
  const made = await request('POST', `/api/griot/export/${book.id}`, {
    token: author.accessToken,
    body: { text: 'Secret draft' }
  });
  assert.equal(made.status, 200, made.text);

  const other = await makeMember();
  const res = await request('GET', `/api/griot/adaptations/${made.json.data.adaptationId}`, { token: other.accessToken });
  assert.equal(res.status, 404);
});
