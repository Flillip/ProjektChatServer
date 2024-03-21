import { IncomingMessage, Server } from 'http';
import {WebSocketServer} from 'ws';
import { HttpServer } from '../httpserver/httpServer.js';
import { info } from '../logger.js';
import { SocketConnection } from './socketConnection.js';


export class WSServer {
    private webSocketServer: WebSocketServer;
    private connectedSockets: Set<SocketConnection> = new Set();
    private static instance: WSServer;

    constructor(server: HttpServer) {
        WSServer.instance = this;

        this.connectedSockets = new Set();
        this.webSocketServer = new WebSocketServer({ server: server.getServer() });
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.webSocketServer.on("connection", this.onConnection);
    }

    private onConnection(socket: WebSocket, request: IncomingMessage) {
        info(`client connected!`);

        const socketConnection = new SocketConnection(socket, request, WSServer.instance);
        if (this.connectedSockets == null) this.connectedSockets = new Set()
        this.connectedSockets.add(socketConnection);
    }

    public socketDisconnected(socket: SocketConnection) {
        this.connectedSockets.delete(socket);
    }
}