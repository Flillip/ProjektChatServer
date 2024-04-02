import { IncomingMessage, Server } from 'http';
import {WebSocketServer} from 'ws';
import { HttpServer } from '../httpserver/httpServer.js';
import { info } from '../logger.js';
import { SocketConnection } from './socketConnection.js';
import { Packet } from './packet.js';
import WebSocketEventBus from './wsEventBus.js';


export class WSServer {
    private webSocketServer: WebSocketServer;
    private connectedSockets: Set<SocketConnection> = new Set();
    private static instance: WSServer;

    constructor(server: HttpServer) {
        WSServer.instance = this;

        this.webSocketServer = new WebSocketServer({ server: server.getServer() });
        this.setupEventHandlers();

        WebSocketEventBus.broadcastEvent.register((handler) => this.broadCastToAll(handler.packet, handler.socket, handler.serverGuid))
        WebSocketEventBus.closeEvent.register((handler) => this.socketDisconnected(handler.socket))
    }

    private setupEventHandlers(): void {
        this.webSocketServer.on("connection", (socket: WebSocket, request: IncomingMessage) => this.onConnection(socket, request));
    }

    private onConnection(socket: WebSocket, request: IncomingMessage) {
        info(`client connected!`);

        const socketConnection = new SocketConnection(socket, request);
        this.connectedSockets.add(socketConnection);
    }

    private socketDisconnected(socket: SocketConnection) {
        info(`client disconnected!`);
        this.connectedSockets.delete(socket);
    }

    public broadCastToAll(packet: Packet, ws: SocketConnection, serverGuid: string) {
        this.connectedSockets.forEach(socket => {
            if (ws === socket) return;
            if (ws.getServer() !== serverGuid) return;

            socket.send(packet);
        });
    }
}