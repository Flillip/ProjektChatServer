import express from 'express';
import { ResponseCode } from '../../responseCodes.js';
import DatabaseMediator from '../../../database/databaseMediator.js';
import { error } from '../../../logger.js';
import Message from '../../../message.js';

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const userGuid = req["id"];
    const body = req.body;
    
    if (body["serverGuid"] === undefined) {
        res.sendStatus(ResponseCode.BadRequest);
        return;
    }

    const serverGuid: string = body["serverGuid"];


    const messages: Message[] = await DatabaseMediator.instance.getServerMessages(serverGuid)
        .catch((reason) => {
            error(reason);
            res.sendStatus(ResponseCode.InternalServerError);
            return [];
        });
    
    if (messages.length === 0) return;

    const messageJson = JSON.stringify(messages);
    res.status(ResponseCode.Success).send(messageJson);
}