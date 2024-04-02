import http from "http";
import express from 'express';
import { error, info } from "../logger.js";
import routes from "./routes/index.js";

export class HttpServer {
    private app: express.Express;
    private server: http.Server;

    constructor(private port: number) {
        this.app = express();
        this.server = http.createServer(this.app);

        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(express.static('./src/public'));
        this.app.set('view engine', 'ejs');
        this.app.set('views', './src/views');

        routes(this.app);
    }

    public getServer(): http.Server {
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

        info("Server listening on http://127.0.0.1:" + this.port);
    }
}