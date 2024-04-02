import { randomUUID } from "crypto";
import { info } from "../logger.js";
import { Database } from "./database.js";
import Message from "../message.js";
import Server from "../server.js";

export default class DatabaseMediator {
    public static instance: DatabaseMediator;

    constructor(private db: Database) {
        DatabaseMediator.instance = this;
    }

    public async newUser(name: string, password_hash: string): Promise<string> {
        info("creating user!");
        
        const user_id = randomUUID();
        const query = "INSERT INTO Users (id, name, password_hash) VALUES (?, ?, ?)";
        const params = [user_id, name, password_hash];
    
        await this.db.run(query, params)
        
        return user_id;
    }

    public async checkUniqueUsername(name: string): Promise<boolean> {
        info("checking unique username");

        const query = "SELECT name FROM Users WHERE [name] = ?";
        const params = [name];

        return (await this.db.querySingleRow(query, params)) === undefined;
    }

    public async getUserGuid(name: string, password_hash: string): Promise<string> {
        info("getting guid from username");

        const query = "SELECT id FROM Users WHERE name = ? AND password_hash = ?;";
        const params = [name, password_hash];

        const res = await this.db.querySingleRow(query, params);

        if (res === undefined) return undefined

        return String(res["id"]);
    }

    public async createServer(name: string, ownerGuid: string): Promise<string> {
        info("creating server!");

        const serverGuid = randomUUID();

        const query = "INSERT INTO [Servers] (id, name, owner_id) VALUES (?, ?, ?)";
        const params = [serverGuid, name, ownerGuid];

        await this.db.run(query, params);
        
        return serverGuid;
    }

    public async addUserToServer(userGuid: string, serverGuid: string): Promise<void> {
        info("adding user to server");

        const query = "INSERT INTO [UserServers] (user_id, server_id) VALUES (?, ?);"
        const params = [userGuid, serverGuid];

        await this.db.run(query, params);
    }

    public async removeUserFromServer(userGuid: string, serverGuid: string): Promise<void> {
        info("removing user from server");

        const query = "DELETE FROM UserServers WHERE user_id = ? AND server_id = ?;";
        const params = [userGuid, serverGuid];

        await this.db.run(query, params);
        await this.deleteServerIfOwnerLeaves(userGuid, serverGuid);
    }

    private async getServerOwner(serverGuid: string): Promise<string> {
        const query = "SELECT owner_id FROM Servers WHERE id = ?;";
        const params = [ serverGuid ];

        const res = await this.db.querySingleRow(query, params);
        return String(res["owner_id"]);
    }

    private async deleteServerIfOwnerLeaves(userGuid: string, serverGuid: string): Promise<void> {

        const owner = await this.getServerOwner(serverGuid);
        if (owner !== userGuid) return;
        
        const query = "DELETE FROM Servers WHERE owner_id = ? AND id = ?;";
        const params = [userGuid, serverGuid];

        await this.db.run(query, params);
    }

    public async getUserServers(user: string): Promise<Server[]> {
        info("getting servers");

        const query = "SELECT server_id FROM UserServers WHERE user_id = ?;";
        const params = [user];

        const res = await this.db.executeQuery(query, params);
        
        if (!Array.isArray(res)) 
            throw new Error("getUserServers, res is not an array");

        const serverGuids = res.map(val => String(val["server_id"]));
        const servers: Server[] = [];

        for await (const guid of serverGuids) {
            const name = await this.getServerName(guid);
            console.log(name);
            servers.push(new Server(name, guid));
        }

        return servers;
    }

    private async getServerName(guid: string): Promise<string> {
        const query = "SELECT name FROM Servers WHERE id = ?;";
        const res = await this.db.querySingleRow(query, [guid]);

        return String(res["name"]);
    }

    public async getServerMessages(serverGuid: string, offset: number = 20): Promise<Message[]> {
        const query = "SELECT sender_id, message_content, sent_at FROM Messages WHERE server_id = ? LIMIT ? OFFSET ?";
        const params: string[] = [serverGuid, "20", String(offset)];

        const res = await this.db.executeQuery(query, params)

        if (Array.isArray(res)) return res.map(val => new Message(val["message_content"], val["sender_id"], val["sent_at"], serverGuid));
        else throw new Error("getUserServersHandler, res is not an array");
    }

    public async addMessage(message: Message): Promise<void> {
        const query = "INSERT INTO Messages (id, sender_id, server_id, message_content, sent_at) VALUES (?, ?, ?, ?, ?);";
        const params = [`${randomUUID()}`, message.sender, message.server, message.message, String(message.timestamp)];

        await this.db.run(query, params);
    }

    public async getUsername(userGuid: string): Promise<string> {
        const query = "SELECT name FROM Users WHERE id = ?;";
        const params = [userGuid];

        const res = await this.db.querySingleRow(query, params);
        return String(res["name"]);
    }
    
}