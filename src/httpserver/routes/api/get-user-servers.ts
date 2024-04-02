import express from 'express';
import { ResponseCode } from '../../responseCodes.js';
import DatabaseMediator from '../../../database/databaseMediator.js';
import { error } from '../../../logger.js';

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const userGuid = req["id"];

    let anyError = false;

    const servers = await DatabaseMediator.instance.getUserServers(userGuid)
        .catch((reason) => {
            error(reason);
            res.sendStatus(ResponseCode.InternalServerError);
            anyError = true;
        });
    
    if (anyError) return;

    const serversJSON = JSON.stringify(servers);
    res.status(ResponseCode.Success).send(serversJSON);
}