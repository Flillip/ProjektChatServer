import { IncomingMessage } from "http";
import { info } from "../logger.js";
import { WSServer } from "./webSocketServer.js";

export class SocketConnection {
    constructor(private socket: WebSocket, private request: IncomingMessage, private wsServer: WSServer) {
        const userValid = this.validateUser();
        if (!userValid) {
            info(`Socket was not valid.`);
            this.socket.close();
            this.wsServer.socketDisconnected(this);
        }
    }

    private validateUser(): boolean {
        // validation yes yes
        if (this.request.headers["test"] != "123") {
            return false;
        }
        return true;
    }
}