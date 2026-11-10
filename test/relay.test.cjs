'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const WebSocket = require('ws');
const { createGameServer } = require('../server.cjs');

async function fixture(t) {
  const app = createGameServer(); app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  const origin = `http://127.0.0.1:${app.server.address().port}`, clients = [];
  t.after(() => app.close());
  async function peer(room, customOrigin = origin) {
    const ws = new WebSocket(origin.replace('http:', 'ws:') + '/relay?gameId=' + encodeURIComponent(room), { origin: customOrigin });
    clients.push(ws);
    const history = [], waiting = [];
    ws.on('error', () => {});
    ws.on('message', bytes => {
      const value = JSON.parse(bytes.toString()); history.push(value);
      for (const waiter of waiting.slice()) if (waiter.predicate(value)) { clearTimeout(waiter.timer); waiting.splice(waiting.indexOf(waiter), 1); waiter.resolve(value); }
    });
    const wait = predicate => {
      const value = history.find(predicate); if (value) return Promise.resolve(value);
      return new Promise((resolve, reject) => {
        const waiter = { predicate, resolve, timer: setTimeout(() => reject(new Error('Timed out waiting for relay message')), 2000) }; waiting.push(waiter);
      });
    };
    const welcome = await wait(m => m.type === 'welcome' || m.type === 'error');
    return { ws, history, wait, welcome, send: m => ws.send(JSON.stringify(m)) };
  }
  return { app, origin, peer };
}

test('serves the playable website, health, and only public files', async t => {
  const { origin } = await fixture(t);
  const page = await fetch(origin); assert.equal(page.status, 200); assert.match(await page.text(), /CU Escape/);
  for(const route of ['/desktop','/mobile']){const game=await fetch(origin+route);assert.equal(game.status,200);assert.equal(game.headers.get('cache-control'),'no-store');assert.match(await game.text(),/Copy room link/);}
  const health = await (await fetch(origin + '/healthz')).json(); assert.equal(health.multiplayer, true); assert.equal(health.maxPlayersPerRoom, 16);
  assert.equal((await fetch(origin + '/server.cjs')).status, 404);
  assert.equal((await fetch(origin + '/package.json')).status, 404);
  assert.equal((await fetch(origin + '/relay')).status, 426);
});

test('three real WebSocket clients exchange authenticated game traffic, isolated by room', async t => {
  const { peer } = await fixture(t);
  const a = await peer('group-a'), b = await peer('group-a'), c = await peer('group-a'), other = await peer('group-b');
  assert.deepEqual(c.welcome.players, [1, 2, 3]); assert.deepEqual(other.welcome.players, [1]);
  b.send({ type: 'ens_input', playerId: 999, input: { w: true, angle: 0 } });
  assert.equal((await a.wait(m => m.type === 'ens_input')).playerId, 2);
  b.send({type:'ens_action',action:'drop_key'});assert.equal((await a.wait(m=>m.type==='ens_action')).action,'drop_key');
  a.send({ type: 'ens_state', host: 1, round: 'test-round', v: 19 });
  assert.equal((await b.wait(m => m.type === 'ens_state')).round, 'test-round');
  assert.equal((await c.wait(m => m.type === 'ens_state')).playerId, 1);
  await new Promise(resolve => setTimeout(resolve, 40));
  assert(!other.history.some(m => m.type === 'ens_state'));
});

test('host departure elects the remaining lowest ID without resetting the room', async t => {
  const { peer, app } = await fixture(t);
  const a = await peer('handoff'), b = await peer('handoff'), c = await peer('handoff');
  b.send({ type: 'ens_state', host: 2, round: 'forged' });
  assert.equal((await b.wait(m => m.type === 'error')).code, 'host_only');
  a.ws.close(); await b.wait(m => m.type === 'player_left' && m.playerId === 1);
  assert.equal(app.rooms.get('handoff').host, 2);
  b.send({ type: 'ens_state', host: 2, round: 'preserved-round', playerId: 888 });
  const state = await c.wait(m => m.type === 'ens_state'); assert.equal(state.playerId, 2); assert.equal(state.round, 'preserved-round');
  const d = await peer('handoff'); assert.equal(d.welcome.playerId, 4); assert.deepEqual(d.welcome.players, [2, 3, 4]);
});

test('validates room names and enforces the sixteen-player room limit', async t => {
  const { peer } = await fixture(t);
  assert.equal((await peer('../invalid')).welcome.code, 'invalid_game_id');
  for (let n = 0; n < 16; n++) assert.equal((await peer('capacity')).welcome.type, 'welcome');
  assert.equal((await peer('capacity')).welcome.code, 'game_full');
});

test('rejects cross-origin WebSocket connections', async t => {
  const { origin } = await fixture(t);
  const status = await new Promise((resolve, reject) => {
    const ws = new WebSocket(origin.replace('http:', 'ws:') + '/relay?gameId=origin-test', { origin: 'https://unrelated.example' });
    ws.on('unexpected-response', (_request, response) => { resolve(response.statusCode); response.resume(); ws.terminate(); });
    ws.on('error', () => {}); ws.on('open', () => { ws.terminate(); reject(new Error('Unexpectedly accepted foreign origin')); });
  });
  assert.equal(status, 403);
});
