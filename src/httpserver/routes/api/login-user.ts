import express from 'express';
import { ResponseCode } from '../../responseCodes.js';
import jwt from 'jsonwebtoken';
import { error } from '../../../logger.js';
import DatabaseMediator from '../../../database/databaseMediator.js';

export default async function(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const body = req.body;
    
    if (body["username"] === undefined || body["password"] === undefined) {
        res.sendStatus(ResponseCode.BadRequest);
        return;
    }
    
    const username = String(body["username"]);
    const password = String(body["password"]);
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        error("couldn't find JWT secret!")
        res.sendStatus(ResponseCode.InternalServerError);
        return;
    }

    let anyError = false;

    const userGuid = await DatabaseMediator.instance.getUserGuid(username, password)
        .catch((reason) => {
            error(reason);
            res.sendStatus(ResponseCode.InternalServerError);
            anyError = true;
        });

    if (anyError) return;
    if (userGuid === undefined) {
        res.sendStatus(ResponseCode.Unauthorized);
        return;
    }

    const token = jwt.sign({ id: userGuid }, secret, { expiresIn: '24h' });
    res.status(ResponseCode.Success).json({token});
}