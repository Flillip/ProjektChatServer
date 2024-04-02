export default class Message {
    constructor(public readonly message: string, public readonly sender: string, public readonly timestamp: number, public readonly server: string) { }

    private formatTime(): string {
        const date = new Date(this.timestamp);
        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    
        return `${hours}:${minutes}`;
    }
}