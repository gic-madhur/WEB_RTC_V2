import { Injectable } from '@angular/core';
//import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  constructor() {}

  logPresence(stateId: number): void {
    const req: LogPresenceRequest = { stateId, beginLocal: new Date() };
    //this.signalr.send('LogPresence', req);
  }
}

interface LogPresenceRequest {
  stateId: number;
  beginLocal: Date | string;
}
