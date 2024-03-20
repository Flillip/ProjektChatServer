import 'dotenv/config'
import { createServer } from 'http';
import {WebSocketServer} from 'ws';

import { error, info } from './logger.js';
const PORT = Number(process.env.PORT || 3000);

const server = createServer();
const webSocketServer = new WebSocketServer({ server });

webSocketServer.on('connection', (ws: WebSocketServer) => {
    info("client connected");

    ws.on("message", (message: Buffer) => {
        console.log(message.toString());
    })

    ws.on("close", () => {
        console.log("client disconnected");
    })
});

server.listen(PORT);

server.on('error', (e: Error) => {
    if (e.name === 'EADDRINUSE') {
      error("port already in use")
      process.exit(1);
    }
});

info("listening on port: " + PORT)