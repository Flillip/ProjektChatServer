import 'dotenv/config'

import { HttpServer } from './httpserver/httpServer.js';
import { WSServer } from './websocket/webSocketServer.js';
const PORT = Number(process.env.PORT || 3000);

const httpServer = new HttpServer(PORT);
const webSocketServer = new WSServer(httpServer);

httpServer.listen();

// const webSocketServer = new WebSocketServer({ server });

// webSocketServer.on('connection', (ws: WebSocketServer) => {
//     info("client connected");

//     ws.on("message", (message: Buffer) => {
//         console.log(message.toString());
//     })

//     ws.on("close", () => {
//         console.log("client disconnected");
//     })
// });
