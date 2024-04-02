import { NextFunction, Request, Response } from "express";
import { ResponseCode } from "../responseCodes.js";
import { error } from "../../logger.js";
import jwt from 'jsonwebtoken';

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.sendStatus(ResponseCode.InternalServerError);
        return;
    }

    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        res.sendStatus(ResponseCode.Unauthorized);
        return;
    }

    const split = bearerToken.split(' ');

    if (split.length === 1 || split[0] !== 'Bearer') {
        res.sendStatus(ResponseCode.Unauthorized);
        return;
    }

    const token = split[1];

    jwt.verify(token, secret, (err: Error, decoded: any) => {
        if (err) {
            error("Error verifying token: " + err.message);
            res.sendStatus(ResponseCode.Unauthorized);
            return;
        }

        if (!decoded["id"] || !decoded["exp"]) {
            res.sendStatus(ResponseCode.Unauthorized);
            return;
        }

        const timestamp = new Date().getTime() / 1000 | 0;
        const expires = Number(decoded["exp"]);

        if (expires <= timestamp)
        {
            console.log(expires, timestamp)
            res.sendStatus(ResponseCode.Forbidden);
            return;
        }


        req["id"] = decoded["id"];
        next();
    });
}