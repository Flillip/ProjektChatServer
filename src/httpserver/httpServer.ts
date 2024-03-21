import { Server, createServer } from "http";
import { error, info } from "../logger.js";

export class HttpServer {
    private server: Server;

    constructor(private port: number) {
        this.server = createServer();
    }

    public getServer(): Server {
        return this.server;
    }

    public listen(): void {
        this.server.listen(this.port);
        
        this.server.on('error', (e: Error) => {
            if (e.name === 'EADDRINUSE') {
              error("port already in use")
              process.exit(1);
            }
        });

        info("Server listening on port " + this.port);
    }
}