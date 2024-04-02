import express from "express";

export default function(req: express.Request, res: express.Response, next: express.NextFunction): void {
    // const chat = req.params["chat"];
    // console.log("chat guid: " + chat)
    
    // DatabaseEventBus.getServerMessagesEvent.emit( {server: chat, offset: 0, callback: (msgs, err) => {
    //     DatabaseEventBus.getUserServersEvent.emit({ user: req["id"], callback: (servers, err) => {

    //         // code stuff
    //     }});    
    // }});

    
    res.render('./pages/chat', { test: "Hejsan svejsan" });
}