import express from 'express';
import { ResponseCode } from '../../responseCodes.js';
import DatabaseMediator from '../../../database/databaseMediator.js';
import { error } from '../../../logger.js';

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const body = req.body;
    const userId = req["id"];

    if (body["name"] === undefined) {
        res.sendStatus(ResponseCode.BadRequest);
        return;
    }

    const name = body["name"];
    let any_error = false;
    
    const serverGuid = await DatabaseMediator.instance.createServer(name, userId)
        .catch((reason) => {
            error(reason); 
            res.sendStatus(ResponseCode.InternalServerError);
            any_error = true;
        });
    
    if (any_error) return;

    await DatabaseMediator.instance.addUserToServer(userId, String(serverGuid))
        .catch((reason) => {
            error(reason);
            res.sendStatus(ResponseCode.InternalServerError);
            any_error = true;
        });
    
    if (any_error) return;

    res.sendStatus(ResponseCode.Created);
}