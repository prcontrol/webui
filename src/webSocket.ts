import io, { Socket } from "socket.io-client";
import { wsUrl } from "./main";
import { ReactorState } from "./dataStore";

class WebSocketObservable<Data> {
  private listeners: ((_:Data)=>void)[] = [];

  public register(fn: (_:Data)=>void) {
    this.listeners.push(fn);
  }

  public dispatch(data: Data): void {
    this.listeners.forEach(fn => fn(data));
  }
}

export class WebSocketService {
  private socket: Socket;
  public observables = {
    pcrdata: new WebSocketObservable<ReactorState>()
  }

  constructor(url: URL) {
    this.socket = io(url);
    this.socket.on("pcrdata", (message) => {
      const state: ReactorState = message.data;
      this.observables.pcrdata.dispatch(state);
    });
  }


  public close(): void {
    if(this.socket){
      this.socket.close();
    }
  }
}
