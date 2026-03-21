# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the server

```bash
node simulacion.js
```

The server starts on `http://localhost:3000`. There is no build step, lint, or test setup.

Install dependencies:
```bash
npm install
```

## Architecture

This is a Node.js/Express app simulating an async ticket support system with an in-process event broker.

**Request flow:**
1. `POST /tickets` (routes.js) creates a ticket, stores it in the in-memory Map, then emits `ticket_creado` on the broker.
2. The broker (`src/broker/broker.js`) is a Node.js `EventEmitter` singleton shared across the app.
3. `src/broker/eventHandler.js` listens for `ticket_creado`, waits 7 seconds (simulating async processing), updates the ticket's `estado` to `"Asignado a Técnico"`, then performs a self-fetch to verify the update.
4. `GET /tickets/:id` returns the current state of a ticket from the in-memory Map.

**In-memory DB:** `src/db/database.js` exports a single `Map` used as the database. Data is lost on restart.

## Known bugs in existing code

- `simulacion.js` imports `{ router }` from routes but mounts `ticketRoutes` (undefined). Should be `app.use('/tickets', router)`.
- `src/broker/broker.js` uses ESM `import` syntax (`import { EventEmitter } from 'events'`) but exports with CommonJS `module.exports`. The rest of the codebase uses `require()`. This file should use `const { EventEmitter } = require('events')`.
