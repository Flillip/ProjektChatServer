import TypedEvent from "typesafe-typed-event";
import { SocketConnection } from "./socketConnection.js";
import { Packet } from "./packet.js";

interface ICloseData {
    socket: SocketConnection;
}

interface IBroadcastData {
    packet: Packet;
    socket: SocketConnection;
    serverGuid: string; 
}


export default class WebSocketEventBus {
    public static closeEvent = new TypedEvent.TypedEvent<ICloseData>();
    public static broadcastEvent = new TypedEvent.TypedEvent<IBroadcastData>();
}