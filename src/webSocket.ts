import io, { Socket } from "socket.io-client";
import { ReactorState } from "./dataStore";

class WebSocketObservable<Data> {
  private listeners: ((_:Data)=>void)[] = [];

  public register(fn: (_:Data)=>void) {
    this.listeners.push(fn);
  }

  public dispatch(data: Data): void {
    console.log("Dispatching", data);
    this.listeners.forEach((fn => fn(data)));
  }
}

export class WebSocketService {
  private socket: Socket;
  public observables = {
    pcrdata: new WebSocketObservable<ReactorState>(),
  }

  constructor(url: URL) {
    this.socket = io(url);
    this.socket.on("pcrdata", async (message) => {
      const state: ReactorState = JSON.parse(message.data); // Parse the JSON-Strings to a JavaScript-Object
      this.observables.pcrdata.dispatch(state);
    });
  }


  public close(): void {
    if(this.socket){
      this.socket.close();
    }
  }
}
