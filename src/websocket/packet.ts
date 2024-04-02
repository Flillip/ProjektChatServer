import Message from "../message.js";

export enum PacketType {
    MESSAGE = "msg",
    ERROR = "err"
}

export class Packet {
    constructor(public readonly type: PacketType, public readonly message: string) {}

    /**
     * Returns a Buffer object containing the JSON representation of the current object.
     *
     * @return {Buffer} The Buffer object containing the JSON representation.
     */
    public getBuffer(): string {
        return (JSON.stringify({
            type: this.type,
            message: this.message
        }));
    }

    public static createMessagePacket(message: Message): Packet {
        const jsonMsg = JSON.stringify(message);
        const packet = new Packet(PacketType.MESSAGE, jsonMsg);
        
        return packet;
    }
}