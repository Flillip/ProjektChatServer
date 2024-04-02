import express from 'express';
import verifyToken from '../../middleware/validation.js';

const chatRouter = express.Router();

chatRouter.route('/')
    .get((await import("./chat.js")).default);

chatRouter.route('/:chat')
    .get((await import("./chat.js")).default);

export default chatRouter;