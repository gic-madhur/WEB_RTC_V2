import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SIPService {
  private statusSub = new BehaviorSubject<string>(null);
  status$ = this.statusSub.asObservable();
  private set status(val: string) {
    this.statusSub.next(val);
  }

  private errorSub = new BehaviorSubject<boolean>(false);
  error$ = this.errorSub.asObservable();
  private set error(val: boolean) {
    this.errorSub.next(val);
  }

  private ringingSub = new BehaviorSubject<boolean>(false);
  ringing$ = this.ringingSub.asObservable();
  private set ringing(val: boolean) {
    this.ringingSub.next(val);
  }

  private connectedSub = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSub.asObservable();
  private set connected(val: boolean) {
    this.connectedSub.next(val);
  }

  private nailedInSub = new BehaviorSubject<boolean>(false);
  nailedIn$ = this.nailedInSub.asObservable();
  private set nailedIn(val: boolean) {
    this.nailedInSub.next(val);
  }

  private mediaStreamSub = new BehaviorSubject<MediaStream>(null);
  mediaStream$ = this.mediaStreamSub.asObservable();
  private set mediaStream(val: MediaStream) {
    this.mediaStreamSub.next(val);
  }

  private hasMicSub = new BehaviorSubject<boolean>(false);
  hasMic$ = this.hasMicSub.asObservable();
  private get hasMic(): boolean {
    return this.hasMicSub.value;
  }
  private set hasMic(val: boolean) {
    this.hasMicSub.next(val);
  }

  private configuration: UAConfiguration;
  private answerOptions: AnswerOptions;
  private webRTCPhone: UA;
  private rtcSession: RTCSession;

  constructor(private auth: AuthService) {}

  public requestMic(): void {
    this.setStatus('Accessing microphone...');
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.hasMic = true;
        this.setStatus('Click to Connect');
      })
      .catch((err) => {
        this.hasMic = false;
        this.setError('Microphone access blocked');
      });
  }

  private setStatus(status: string): void {
    this.status = status;
    this.error = false;
  }

  private setError(status: string): void {
    this.status = status;
    this.error = true;
  }

  startJsSip(): void {
    if (this.hasMic) {
      if (!this.webRTCPhone) {
        this.initJsSip();
      }
      if (!this.webRTCPhone.isConnected()) {
        this.webRTCPhone.start();
      }
    }
  }

  private initJsSip(): void {
    this.auth.getLoggedinUser();
    // debug.enable('JsSIP:*');
    // /debugger
    //const user = this.auth.user;
    const user = this.auth.user;
    const socket = new WebSocketInterface('wss://wss.unity4.com:8089/ws');
    this.configuration = {
      display_name: user.userID? user.userID.toString() : null,
      uri: 'sip:' + user.userID + '@wss.unity4.com',
      password: user.sessionId,
      sockets: [socket],
      registrar_server: null,
      contact_uri: null,
      authorization_user: user.userID? user.userID.toString() : null,
      instance_id: null,
      session_timers: true,
      use_preloaded_route: false,
    };
    this.answerOptions = {
      mediaConstraints: { audio: true, video: false },
      // rtcpMuxPolicy: 'require',
      pcConfig: {
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302'],
          },
        ],
      },
    };

    this.webRTCPhone = new UA(this.configuration);
    this.webRTCPhone.on(
      'newRTCSession',
      (incomingRtcSessionEvent: IncomingRTCSessionEvent) => {
        this.setStatus('Incoming call');
        this.hangup();
        this.rtcSession = incomingRtcSessionEvent.session;
        this.rtcSession.on('ended', (endEvent: EndEvent) => {
          this.rtcSession = null;
          this.setDisconnected();
        });
        this.rtcSession.on('failed', (endEvent: EndEvent) => {
          this.setError('Call failed');
          this.rtcSession = null;
        });
        this.rtcSession.on('getusermediafailed', (...args: any[]) => {
          this.setError('Get User Media Failed');
        });
        this.rtcSession.on('accepted', (incomingEvent: IncomingEvent) => {
          this.setStatus('Call accepted');
        });
        this.rtcSession.on('confirmed', (incomingEvent: IncomingEvent) => {
          this.setNailedIn();
        });
        this.rtcSession.on(
          'peerconnection',
          (peerConnectionEvent: PeerConnectionEvent) => {
            const peerconnection = peerConnectionEvent.peerconnection;

            peerconnection.ontrack = (rtcTackEvent: RTCTrackEvent) => {
              this.setStatus('Connecting audio...');
              this.mediaStream = rtcTackEvent.streams[0];
              // remoteAudio.srcObject = voipServer.mediaStream$
              // remoteAudio.play();
            };
          }
        );

        if (this.rtcSession.direction === 'incoming') {
          try {
            this.ringing = true;
            // incomingCallAudio.play();
          } catch (err) {
            this.setError(err);
          }
        }

        // attempt auto-answer, but let it ring for half-sec...
        setTimeout(() => this.answerCall());
      }
    );

    this.webRTCPhone.on('connected', (connectedEvent: ConnectedEvent) => {
      this.setConnected();
    });

    this.webRTCPhone.on('disconnected', (disconnectEvent: DisconnectEvent) => {
      this.setDisconnected();
    });
  }

  private stopJsSip(): void {
    if (this.webRTCPhone && this.webRTCPhone.isConnected()) {
      this.webRTCPhone.stop();
    }
  }

  private answerCall(): void {
    this.rtcSession.answer(this.answerOptions);
  }

  private hangup(): void {
    if (this.rtcSession) {
      this.rtcSession.terminate();
      this.rtcSession = null;
    }
  }

  private setDisconnected(): void {
    this.connected = false;
    this.nailedIn = false;
    this.setStatus('Click to Connect');
  }

  private setConnected(): void {
    this.connected = true;
    this.setStatus('Connected, awaiting Nail In');
  }

  private setNailedIn(): void {
    this.nailedIn = true;
    this.setStatus('Nailed In');
  }
}
