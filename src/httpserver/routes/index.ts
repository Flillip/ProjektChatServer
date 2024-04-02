import express from 'express';
import apiRoutes from "./api/index.js";
import chatRouter from './chat/index.js';

const indexRouter = express.Router();

indexRouter.route('/')
    .get((await import("./initial.js")).default);

export default function(app: express.Express) {
    app.use("/", indexRouter);
    app.use("/api", apiRoutes);
    app.use("/chat", chatRouter);
}
