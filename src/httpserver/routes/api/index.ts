import express from 'express';
import verifyToken from '../../middleware/validation.js';

const ApiRouter = express.Router();

ApiRouter.route("/new-user")
    .post((await import("./new-user.js")).default);

ApiRouter.route("/login")
    .post((await import("./login-user.js")).default);

ApiRouter.route("/create-server")
    .post(verifyToken, (await import("./create-server.js")).default);

ApiRouter.route("/join-server")
    .post(verifyToken, (await import("./join-server.js")).default);

ApiRouter.route("/leave-server")
    .post(verifyToken, (await import("./leave-server.js")).default);

ApiRouter.route("/get-user-servers")
    .get(verifyToken, (await import("./get-user-servers.js")).default);

ApiRouter.route("/get-username")
    .get(verifyToken, (await import("./get-username.js")).default);

export default ApiRouter;