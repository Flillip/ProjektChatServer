import { IncomingMessage } from "http";
import { error, info } from "../logger.js";
import { Packet, PacketType } from "./packet.js";
import WebSocketEventBus from "./wsEventBus.js";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Message from "../message.js";
import DatabaseMediator from "../database/databaseMediator.js";


export class SocketConnection {
    // public closeEvent = new CustomEvent("close");
    private serverGuid: string;

    constructor(private socket: WebSocket, private request: IncomingMessage) {
        const userValid = this.validateUser();
        if (!userValid) {
            info(`Socket was not valid.`);
            this.sendError("Authentication failed.");
            this.close();
            return;
        }

        const urlParams = new URLSearchParams(request.url.replace("/chat/", ""))
        this.serverGuid = urlParams.get("server") ?? 'global';
        console.log(this.serverGuid)

        this.send(
            Packet.createMessagePacket(
                new Message(
                    "Welcome!", 
                    "server", 
                    Math.round(new Date().getTime() / 1000),
                    "global"
                )
            )
        );
        
        // this.sendMessage("greetings!");

        this.socket.addEventListener('message', (ev: MessageEvent) => this.onMessage(ev));
        this.socket.addEventListener('close', () => this.close());
    }

    private validateUser(): boolean {
        const token = this.request.headers['sec-websocket-protocol'];
        const secret = process.env.JWT_SECRET;
        if (!secret) return false;
        if (!token) return false;

        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            error("Error verifying token: " + err.message);
            return false;
        }

        if (!decoded["id"] || !decoded["exp"]) return false;

        const timestamp = new Date().getTime() / 1000 | 0;
        const expires = Number(decoded["exp"]);

        if (expires <= timestamp)
        {
            console.log(expires, timestamp)
            return false;
        }

        return true;
    }

    public sendError(message: string) {
        const packet = new Packet(PacketType.ERROR, message);
        this.send(packet);
    }

    public sendMessage(message: string) {
        const packet = new Packet(PacketType.MESSAGE, message);
        this.send(packet);
    }

    public send(packet: Packet) {
        this.socket.send(packet.getBuffer());
    }

    private close(): void {
        this.socket.close();
        WebSocketEventBus.closeEvent.emit({ socket: this });
    }

    private async onMessage(ev: MessageEvent) {
        const data = JSON.parse(ev.data);
        const packet = new Packet(data["type"], data["message"]);

        switch (packet.type) {
            case PacketType.MESSAGE:
                WebSocketEventBus.broadcastEvent.emit({packet: packet, socket: this, serverGuid: this.getServer() });

                const msgJSON = JSON.parse(packet.message);
                const msg = new Message(msgJSON["message"], msgJSON["sender"], msgJSON["timestamp"], this.serverGuid);
                await DatabaseMediator.instance.addMessage(msg);
        }
    }

    public getServer() {
        return this.serverGuid;
    }
}