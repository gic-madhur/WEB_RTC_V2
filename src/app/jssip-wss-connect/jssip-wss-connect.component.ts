import { Component, OnInit } from '@angular/core';
import { WebSocketInterface, UA, debug } from 'jssip';

import {
  RTCSession,
  EndEvent,
  IncomingEvent,
  PeerConnectionEvent,
  AnswerOptions,
} from 'jssip/lib/RTCSession';
import {
  UAConfiguration,
  IncomingRTCSessionEvent,
  ConnectedEvent,
} from 'jssip/lib/UA';
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface';

@Component({
  selector: 'app-jssip-wss-connect',
  templateUrl: './jssip-wss-connect.component.html',
  styleUrls: ['./jssip-wss-connect.component.css']
})
export class JssipWssConnectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   

    // }, 30000)
  }

 
}

