import { Server } from 'http';
import {WebSocketServer} from 'ws';


export class WSServer {
    private webSocketServer: WebSocketServer;

    constructor(private readonly server: Server) {
        this.webSocketServer = new WebSocketServer({ server });
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        
    }
}