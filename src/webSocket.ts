
class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Record<string, ((data: any)=>void)[]> = {};

  public openWebSocket(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const {event: key} = message;
      if(this.listeners[key]){
        this.listeners[key].forEach((listener) => listener(message));
      }
    };
  }

  public subscribe(event: string, listener: (data:any) => void): void {
    if(!this.listeners[event]){
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public close(): void {
    if(this.socket){
      this.socket.close();
    }
  }
}
const webSocket = new WebSocketService();
export default webSocket;
