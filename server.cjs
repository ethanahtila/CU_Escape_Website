'use strict';
const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const { WebSocketServer, WebSocket } = require('ws');

function createGameServer(options = {}) {
  const rooms = new Map();
  const maxPlayers = options.maxPlayers || 16;
  const maxClients = options.maxClients || 256;
  const publicOrigin = options.publicOrigin || process.env.PUBLIC_ORIGIN || '';
  const allowedOrigin = publicOrigin ? new URL(publicOrigin).origin : null;
  const publicDir = options.publicDir || path.join(__dirname, 'public');
  let shuttingDown = false;
  const clientCount = () => [...rooms.values()].reduce((n, r) => n + r.players.size, 0);
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
  };
  const files = {
    '/': ['index.html', 'text/html; charset=utf-8'],
    '/index.html': ['index.html', 'text/html; charset=utf-8'],
    '/desktop': ['desktop.html', 'text/html; charset=utf-8'],
    '/mobile': ['mobile.html', 'text/html; charset=utf-8'],
    '/favicon.svg': ['favicon.svg', 'image/svg+xml'],
    '/robots.txt': ['robots.txt', 'text/plain; charset=utf-8']
  };
  const certPath=options.certPath||process.env.TLS_CERT_PATH,keyPath=options.keyPath||process.env.TLS_KEY_PATH;
  if(!!certPath!==!!keyPath)throw Error('Set both TLS_CERT_PATH and TLS_KEY_PATH.');
  const createServer=certPath?handler=>https.createServer({cert:fs.readFileSync(certPath),key:fs.readFileSync(keyPath)},handler):handler=>http.createServer(handler);
  const server = createServer((req, res) => {
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; }
    catch { res.writeHead(400, headers); return res.end('Bad request'); }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); return res.end();
    }
    if (pathname === '/healthz') {
      res.writeHead(shuttingDown ? 503 : 200, { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ status: shuttingDown ? 'stopping' : 'ok', multiplayer: true, rooms: rooms.size, players: clientCount(), maxPlayersPerRoom: maxPlayers }));
    }
    if (pathname === '/relay') { res.writeHead(426, headers); return res.end('A WebSocket connection is required.'); }
    const file = files[pathname];
    if (!file) { res.writeHead(404, headers); return res.end('Not found'); }
    fs.readFile(path.join(publicDir, file[0]), (error, bytes) => {
      if (error) { res.writeHead(500, headers); return res.end('Unable to load the game.'); }
      res.writeHead(200, { ...headers, 'Content-Type': file[1], 'Content-Length': bytes.length, 'Cache-Control': file[0] === 'favicon.svg' ? 'public, max-age=86400' : 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    });
  });
  const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024, perMessageDeflate: false });
  const send = (ws, message) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (ws.bufferedAmount > 512 * 1024) { ws.close(1013, 'Connection too slow'); return; }
    ws.send(JSON.stringify(message));
  };
  const error = (ws, code, message) => send(ws, { type: 'error', code, message });
  const broadcast = (room, message, except) => {
    for (const ws of room.players.values()) if (ws !== except) send(ws, message);
  };
  const originAllowed = req => {
    if (!req.headers.origin) return false;
    try {
      const origin = new URL(req.headers.origin);
      return ['http:', 'https:'].includes(origin.protocol) && (allowedOrigin ? origin.origin === allowedOrigin : origin.host === req.headers.host);
    } catch { return false; }
  };
  server.on('upgrade', (req, socket, head) => {
    let url;
    try { url = new URL(req.url, 'http://localhost'); }
    catch { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); return; }
    if (url.pathname !== '/relay') { socket.end('HTTP/1.1 404 Not Found\r\n\r\n'); return; }
    if (shuttingDown) { socket.end('HTTP/1.1 503 Service Unavailable\r\n\r\n'); return; }
    if (!originAllowed(req)) { socket.end('HTTP/1.1 403 Forbidden\r\n\r\n'); return; }
    const name = url.searchParams.get('gameId') || '';
    const displayName=Array.from(String(url.searchParams.get('name')||'').replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim()).slice(0,20).join('');
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, name, displayName);
    });
  });
  wss.on('connection', (ws, name, displayName) => {
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(name)) {
      error(ws, 'invalid_game_id', 'Use a room name with 1–32 letters, numbers, underscores or hyphens.'); ws.close(1008); return;
    }
    if (clientCount() >= maxClients) { error(ws, 'server_full', 'The game server is full.'); ws.close(1013); return; }
    let room = rooms.get(name);
    if (!room) { room = { name, phase:'lobby', players: new Map(), nextId: 1, host: null }; rooms.set(name, room); }
    if (room.players.size >= maxPlayers) { error(ws, 'game_full', 'This room already has 16 students. Choose another room.'); ws.close(1008); return; }
    const id = room.nextId++;
    ws.playerId = id; ws.playerName=displayName||'Student '+id; ws.alive = true;
    let tokens = 60, lastRefill = Date.now();
    room.players.set(id, ws); room.host = Math.min(...room.players.keys());
    // Welcome is queued first, so a new student knows their identity before a snapshot arrives.
    send(ws, { type: 'welcome', room:room.name, playerId: id, players: [...room.players.keys()],playerNames:Object.fromEntries([...room.players].map(([id,peer])=>[id,peer.playerName])) });
    broadcast(room, { type: 'player_joined', playerId: id, name:ws.playerName }, ws);
    ws.on('pong', () => { ws.alive = true; });
    ws.on('error', () => {});
    ws.on('message', (bytes, binary) => {
      const now = Date.now(); tokens = Math.min(60, tokens + (now - lastRefill) * .04); lastRefill = now;
      if (tokens < 1) { error(ws, 'rate_limited', 'Too many messages.'); ws.close(1008); return; }
      tokens -= 1;
      if (binary) { error(ws, 'invalid_message', 'Use JSON text messages.'); return; }
      let message;
      try { message = JSON.parse(bytes.toString()); } catch { error(ws, 'invalid_json', 'Invalid JSON.'); return; }
      if (!message || typeof message !== 'object' || Array.isArray(message)) { error(ws, 'invalid_message', 'Invalid game message.'); return; }
      if (!['ens_state', 'ens_input', 'ens_action', 'ens_sync', 'ens_room'].includes(message.type)) { error(ws, 'invalid_message', 'Unsupported game message.'); return; }
      if(message.type==='ens_room'){if(id!==room.host){error(ws,'host_only','Only the host can rename the room.');return;}if(room.phase!=='lobby'){error(ws,'round_active','Return the group to the lobby before renaming.');return;}const next=message.room;if(typeof next!=='string'||!/^[A-Za-z0-9_-]{1,32}$/.test(next)){error(ws,'invalid_game_id','Invalid room name.');return;}if(next===room.name)return;if(rooms.has(next)){error(ws,'room_exists','That room name is already in use. Choose another name.');return;}rooms.delete(room.name);room.name=next;rooms.set(next,room);broadcast(room,{type:'room_renamed',room:next});return;}
      if (message.type === 'ens_state' && (id !== room.host || message.host !== id)) { error(ws, 'host_only', 'Only the current host may publish game state.'); return; }
      if (message.type === 'ens_action' && !['start', 'restart', 'lobby', 'use', 'locker', 'elevator_button', 'drop_key', 'reenter'].includes(message.action)) { error(ws, 'invalid_message', 'Unsupported action.'); return; }
      if (message.type === 'ens_action' && ['start', 'restart', 'lobby'].includes(message.action) && id !== room.host) { error(ws, 'host_only', 'Only the host may start or restart the round.'); return; }
      const verified = { ...message, playerId: id };
      if (message.type === 'ens_state') {room.phase=message.phase;broadcast(room, verified, ws);}
      else if (room.host !== id) send(room.players.get(room.host), verified);
    });
    ws.on('close', () => {
      if (room.players.get(id) !== ws) return;
      room.players.delete(id);
      if (!room.players.size) { rooms.delete(room.name); return; }
      room.host = Math.min(...room.players.keys());
      broadcast(room, { type: 'player_left', playerId: id });
    });
  });
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.alive === false) { ws.terminate(); continue; }
      ws.alive = false; ws.ping();
    }
  }, options.heartbeatMs || 15000);
  heartbeat.unref();
  async function close() {
    shuttingDown = true; clearInterval(heartbeat);
    for (const ws of wss.clients) ws.terminate();
    await new Promise(resolve => wss.close(resolve));
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
  return { server, rooms, wss, close };
}
module.exports = { createGameServer };
if (require.main === module) {
  const app = createGameServer();
  const port = Number(process.env.PORT || 3000);
  app.server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`CU Escape is listening on port ${port}.`));
  let stopping = false;
  const stop = async () => { if (stopping) return; stopping = true; await app.close(); };
  process.on('SIGTERM', stop); process.on('SIGINT', stop);
}
