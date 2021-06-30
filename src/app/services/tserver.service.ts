import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class TServerService {
  constructor(private signalr: SignalrService) {
    signalr.on('Ping', (pingResponse: PingResponse) => {
      // react/change applciation state
    });

    signalr.on(
      'InboundWaiting',
      (inboundWaitingResponse: InboundWaitingResponse) => {
        // react/change applciation state
      }
    );

    signalr.on(
      'InboundConnect',
      (inboundWaitingResponse: InboundConnectResponse) => {
        // react/change applciation state
      }
    );

    signalr.on('PowConnect', (inboundWaitingResponse: PowConnectResponse) => {
      // react/change applciation state
    });

    signalr.on('Dialling', (inboundWaitingResponse: DiallingResponse) => {
      // react/change applciation state
    });

    signalr.on(
      'Disconnected',
      (inboundWaitingResponse: DisconnectedResponse) => {
        // react/change applciation state
      }
    );

    signalr.on('Agent', (agentResponse: AgentResponse) => {
      // react/change applciation state
    });

    signalr.on('Error', (errorResponse: ErrorResponse) => {
      // react/change applciation state
    });
  }

  login(): void {
    this.signalr.send('Login');
  }

  logout(): void {
    this.signalr.send('Logout');
  }

  nailIn(): void {
    this.signalr.send('NailIn');
  }

  nailOut(): void {
    this.signalr.send('NailOut');
  }

  callManual(
    campaignId: number,
    phoneNumber: string,
    callerId: string,
    timeout: number
  ): void {
    const req: CallManualRequest = {
      campaignId,
      phoneNumber,
      callerId,
      timeout,
    };
    this.signalr.send('CallManual', req);
  }

  getNextNumber(): void {
    this.signalr.send('GetNextNumber');
  }

  cancelGetNextNumber(): void {
    this.signalr.send('CancelGetNextNumber');
  }

  inboundConnect(): void {
    this.signalr.send('InboundConnect');
  }

  toggleHold(): void {
    this.signalr.send('ToggleHold');
  }

  hangUp(): void {
    this.signalr.send('HangUp');
  }

  agent3Way(thirdPartyNumber: string, callerId: string, timeout: number): void {
    const req: Agent3WayRequest = { thirdPartyNumber, callerId, timeout };
    this.signalr.send('Agent3Way', req);
  }

  agentRecording(filename: string): void {
    const req: AgentRecordingRequest = { filename };
    this.signalr.send('AgentRecording', req);
  }
}

interface CallManualRequest {
  campaignId: number;
  phoneNumber: string;
  callerId: string;
  timeout: number;
}

interface Agent3WayRequest {
  thirdPartyNumber: string;
  callerId: string;
  timeout: number;
}

interface AgentRecordingRequest {
  filename: string;
}

interface PingResponse {
  timeTag: string;
}

interface InboundWaitingResponse {
  campaignID: string;
  leadID: string;
  agentID: string;
  timeTag: string;
  queueID: string;
  extraData: string;
}

interface InboundConnectResponse {
  campaignID: string;
  leadID: string;
  agentID: string;
  timeTag: string;
  queueID: string;
  recording: string;
  waitTime: string;
  extraData: string;
}

interface PowConnectResponse {
  campaignID: string;
  leadID: string;
  agentID: string;
  timeTag: string;
  queueID: string;
  recording: string;
  waitTime: string;
  extraData: string;
}

interface DiallingResponse {
  campaignID: string;
  leadID: string;
  agentID: string;
  timeTag: string;
  queueID: string;
  recording: string;
  waitTime: string;
  extraData: string;
}

interface DisconnectedResponse {
  campaignID: string;
  leadID: string;
  agentID: string;
  timeTag: string;
  queueID: string;
  termType: string;
  recording: string;
  uniqueIDString: string;
  uniqueID: string;
  duration: string;
  extraData: string;
}

interface WaitingResponse {
  campaignID: string;
  timeTag: string;
}

interface AgentResponse {
  empID: string;
  sessID: string;
  seatID: string;
  noInQ: string;
  uState: string;
  duration: string;
}

interface ErrorResponse {
  errorString: string;
  timeTag: string;
}
