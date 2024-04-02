import express from 'express';
import { ResponseCode } from '../../responseCodes.js';
import DatabaseMediator from '../../../database/databaseMediator.js';
import { error } from '../../../logger.js';

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const userGuid = req["id"];
    const body = req.body;
    
    if (body["serverGuid"] === undefined) {
        res.sendStatus(ResponseCode.BadRequest);
        return;
    }
    
    const serverGuid = String(body["serverGuid"]);

    await DatabaseMediator.instance.addUserToServer(userGuid, serverGuid)
        .catch((reason) => {
            error(reason);
            res.sendStatus(ResponseCode.InternalServerError);
        })
        .then(() => {
            res.sendStatus(ResponseCode.Success);
        });
}