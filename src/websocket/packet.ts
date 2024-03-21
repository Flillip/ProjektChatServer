export enum PacketType {
    MESSAGE = "msg",
    ERROR = "err"
}

export enum StatusCode {
    Success = 200,
    Unauthorized = 401
}

export class Packet {
    constructor(private type: PacketType, private message: string, private status_code: StatusCode = StatusCode.Success) {}

    /**
     * Returns a Buffer object containing the JSON representation of the current object.
     *
     * @return {Buffer} The Buffer object containing the JSON representation.
     */
    public getBuffer(): string {
        return (JSON.stringify({
            type: this.type,
            message: this.message,
            status_code: this.status_code
        }));
    }
}