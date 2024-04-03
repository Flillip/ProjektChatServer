import express from "express";
import DatabaseMediator from "../../../database/databaseMediator.js";
import { error } from "../../../logger.js";

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const serverGuid = req.params["chat"] ?? 'global';

    const users = await getUsers(serverGuid);
    const messages = await DatabaseMediator.instance.getServerMessages(serverGuid, 0);
    const formatted = messages.map((msg) => msg.format());
    
    res.render('./pages/chat', { messages: formatted, users: users });
}

async function getUsers(serverGuid: string): Promise<string[]> {
    const userGuids: string[] = await DatabaseMediator.instance.getUserInServer(serverGuid)
        .catch((reason) => {
            error(reason);
            return [];
        });
    
    if (userGuids.length === 0) return;

    const usernames: string[] = [];
    for (let i = 0; i < userGuids.length; i++) {
        const name = await DatabaseMediator.instance.getUsername(userGuids[i]);
        usernames.push(name);
    }

    return usernames;
}