import 'dotenv/config'

import { HttpServer } from './httpserver/httpServer.js';
import { WSServer } from './websocket/webSocketServer.js';
import { Database } from './database/database.js';
import { error, info } from './logger.js';

export class Program {
    private database: Database;
    private webSocketServer: WSServer;
    private httpsServer: HttpServer;

    public static instance: Program;

    public async CreateProgram() {
        Program.instance = this;

        const PORT = Number(process.env.PORT) || 3000;
        let database: Database;
        database = new Database();
        await database.createDatabase().catch((err: Error) => {
            error(err.message);
            info("Database could not be created, closing and exiting.");
            database.close();
            process.exit(1);
        });

        const httpServer = new HttpServer(PORT);
        new WSServer(httpServer);

        httpServer.listen();
        // database.close();
    }

    public getDatabase(): Database {
        return this.database;
    }

    public getWebSocketServer(): WSServer {
        return this.webSocketServer;
    }


    public getHttpsServer(): HttpServer {
        return this.httpsServer;
    }
}

