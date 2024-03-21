import { IncomingMessage } from "http";
import { info } from "../logger.js";
import { WSServer } from "./webSocketServer.js";
import { StatusCode as StatusCode, Packet, PacketType } from "./packet.js";

export class SocketConnection {
    constructor(private socket: WebSocket, private request: IncomingMessage, private wsServer: WSServer) {
        const userValid = this.validateUser();
        if (!userValid) {
            info(`Socket was not valid.`);
            this.sendError("Authentication failed.", StatusCode.Unauthorized);
            this.close();
            return;
        }

        this.sendMessage("greetings!");
    }

    private validateUser(): boolean {
        // validation yes yes
        if (this.request.headers["test"] !== "123") {
            return false; 
        }

        if (this.request.headers["asd"] === "123") {
            info("broadcast!")
            this.wsServer.broadCastToAll(new Packet(PacketType.MESSAGE, "broadcast!"));
        }

        return true;
    }

    public sendError(message: string, status_code: StatusCode) {
        const packet = new Packet(PacketType.ERROR, message, status_code);
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
        this.wsServer.socketDisconnected(this);
    }
}