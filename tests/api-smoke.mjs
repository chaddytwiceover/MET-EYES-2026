import assert from 'node:assert/strict';
import { once } from 'node:events';

process.env.VERCEL = '1';
delete process.env.GEMINI_API_KEY;
const { default: app } = await import('../api/index.ts');
const server = app.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');
  const artwork = await fetch(`${base}/api/met/object/436535`);
  assert.equal((await artwork.json()).artwork.objectID, 436535);
  const invalid = await fetch(`${base}/api/gemini/ask`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  });
  assert.equal(invalid.status, 400);
  const facts = await fetch(`${base}/api/gemini/facts`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test artwork', artist: 'Test artist' }),
  });
  assert.equal(facts.status, 200);
  assert.ok((await facts.json()).facts);
  console.log('API smoke checks passed: health, artwork, validation, fallback.');
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
