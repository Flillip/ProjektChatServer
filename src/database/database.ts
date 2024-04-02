import sqlite3 from "sqlite3";
import { error, info } from "../logger.js";
import { randomUUID } from "crypto";
// import DatabaseEventBus, { IAddUserToServerData, ICheckUniqueUsernameData, IGetGuidData, IGetServerMessages, IGetUserSeversData, INewServerData, INewUserData } from "./databaseEventBus.js";
import Message from "../message.js";
import DatabaseMediator from "./databaseMediator.js";

export class Database {
    private db: sqlite3.Database;
    public readonly isValid = () => this.db === undefined

    constructor() {
        new DatabaseMediator(this);
    }

    public createDatabase(path: string = "./db/database.db"): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db = new sqlite3.Database(path, async (err: Error) => {
                if (err) {
                    reject("Error connecting to the database: " + err.message);
                    return;
                }
            
                info("Connected to the database successfully.");
                
                await this.createDatabaseTables().catch((_: Error) => {
                    reject("Could not create database tables")
                });

                resolve();
            });
        });        
    }

    private async createDatabaseTables(): Promise<void> {
        const createUserTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createServerTable = `
        CREATE TABLE IF NOT EXISTS Servers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            owner_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES Users(id)
        );`;

        const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS Messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT NOT NULL,
            server_id TEXT NOT NULL,
            message_content TEXT NOT NULL,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES Users(id),
            FOREIGN KEY (server_id) REFERENCES Servers(id)
        );`;

        const createUserServersTable = `
        CREATE TABLE IF NOT EXISTS UserServers (
            user_id TEXT NOT NULL,
            server_id TEXT NOT NULL,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, server_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (server_id) REFERENCES Servers(id)
        );`;

        await this.run(createUserTable, []).catch((_: Error) => {
            throw Error("Could not create user table");
        });

        await this.run(createServerTable, []).catch((_: Error) => {
            throw Error("Could not create server table");
        });

        await this.run(createMessagesTable, []).catch((_: Error) => {
            throw Error("Could not create messages table");
        });

        await this.run(createUserServersTable, []).catch((_: Error) => {
            throw Error("Could not create user servers table");
        });
    }

    public close() {
        this.db.close((err: Error) => {
            if (err) {
                error("There was an error disconnecting from the database: " + err.message);
                return;
            }
            
            info("Disconnected from the database successfully.");
        });
    }
    
    public async executeQuery(query: string, params: string[]): Promise<unknown[]> {
        return new Promise<unknown[]>((resolve, reject) => {
            this.db.all(query, params, (err: Error, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    public async querySingleRow(query: string, params: string[]): Promise<unknown> {
        return new Promise<unknown>((resolve, reject) => {
            this.db.get(query, params, (err: Error, row: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    public async run(query: string, params: string[]) {
        await new Promise<void>((resolve, reject) => {
            this.db.run(query, params, (err: Error) => {
                if (err) {
                    reject("Error running query: " + query + "\nwith params: " + (params.length == 0 ? "none" : params) + "\nerror: " + err.message);
                } else {
                    resolve();
                }
            });
        });
    }
}