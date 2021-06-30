import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { OidcService } from '../app/services/oidc.service';
//import { TenantNews } from './tenant-news.model';
//import { ChatService } from './chat.service';
//import { TServerService } from '../app/services/tserver.service';
//import { PresenceService } from '../app/services/presence.service';
//import { SIPService } from '../app/services/sip.service';
import { PresenceStateConstants } from '../assets/presence-states-constants';
import { WebSocketInterface, UA, debug } from 'jssip';
import { connected } from 'process';
import { SequenceEqualSubscriber } from 'rxjs/internal/operators/sequenceEqual';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  callOptions=null;
  rtcSession;
  user = null;

  error$ = this.oidc.error$;
  //news: TenantNews;
  chatForm: FormGroup;
  //messages$ = this.chat.messages$;

  constructor(
    private oidc: OidcService    
  ) {

  }
  playAudio(){
    let audio = new Audio();
    audio.src = '../assets/audio/telephone-ring-04.mp3';
    audio.load();
    audio.play();
  }
  ngOnInit() {
    this.oidc.user$.subscribe(user => {
      this.user = user;
    })
   //this.playAudio();
  
  }

  
  public answerCall() {
    console.log('answerCall');
    if(this.rtcSession)this.rtcSession.answer(this.callOptions);
}
  login(): void {
    this.oidc.login();

  }

  sendChat(): void {
    //this.chat.send(this.chatForm.value.msg);
  }
  CallUa() {
    const loginuser = this.user;
    var socket = new WebSocketInterface('wss://wss.unity4.com:8089/ws');
    var configuration = {
      sockets: [socket],
      uri: 'sip:' + loginuser.profile.sub + '@wss.unity4.com',
      password: loginuser.profile.sid,
      authorization_jwt: loginuser.access_token
    };
    var ua = new UA(configuration);
    // setTimeout(function () {
    ua.start();
    ua.on('connected', () => {
      console.log(ua.isConnected())
      var eventHandlers = {
        'succeeded': function (e) {
          // console.log(45);
          // console.log(e);
        },
        'failed': function (e) {
          // console.log(48);
          // console.log(e);  
        }
      };
      var text = 'Hello Bob!';

      var options = {
        'eventHandlers': eventHandlers
      };
      var sentobj = ua.sendMessage('sip:54322@wss.unity4.com', text, options)
      console.log('Send Message Triggered:')
      console.log(sentobj)
      ua.on('newMessage',e=>{
      
        console.log(e.request.body)
      })
    })

    ua.on('disconnected', function (e) { console.log(e) });
    var text = 'Hello Bob!';

    // Register callbacks to desired message events
    }
    Call(){
      this.requestMic();
      //audio
      var incomingCallAudio = new Audio('../assets/audio/telephone-ring-04.mp3');
      incomingCallAudio.loop = true;
      var remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudio.crossOrigin = "anonymous";

      var beepAudio = new Audio('../assets/audio/beep-02.mp3');
      beepAudio.loop = false;
      //

      
      const loginuser = this.user;
      var socket = new WebSocketInterface('wss://wss.unity4.com:8089/ws');
      var configuration = {
        sockets: [socket],
        uri: 'sip:' + loginuser.profile.sub + '@wss.unity4.com',
        password: 'lboles1cuqczxqmhjewmdfn1'
      };
      var ua = new UA(configuration);
      ua.start()
      var eventHandlers = {
        'progress': function(e) {
          console.log('call is in progress');
        },
        'failed': function(e) {
          console.log('call failed with cause: ');
          console.log(e);
          //console.log(e.data.cause);
        },
        'ended': function(e) {
          console.log('call ended with cause: '+ JSON.stringify(e));
        },
        'confirmed': function(e) {
          console.log('call confirmed');
          console.log(e)
        },
        'peerconnection':function(e){
          console.log('session.peerconnection', e);
            const peerconnection = e.peerconnection;

            peerconnection.onaddstream = function (e) {
                console.log('peerconnection.onaddstream', e);
                //setStatus("Connecting audio...");
                remoteAudio.srcObject = e.stream;
                remoteAudio.play();
            };
        }
      };

       ua.on('newRTCSession',function(e){ console.log(e) 
        console.log(e.session)
        console.log(e.rtcSession)
        var session = e.session;
        var session = e.session;
        if (this.rtcSession) { // hangup any existing call
            this.rtcSession.terminate();
        }
        this.rtcSession = session;
        this.rtcSession.on("ended", function (e) {
            console.log("session.ended", e)
            this.rtcSession = null;
            //setConnectionReady();
        });
        this.rtcSession.on("failed", function () {
            console.log("session.failed", e)
            //setError("Call failed");
            this.rtcSession = null;
        });
        this.rtcSession.on("getusermediafailed", function () {
            console.log("session.getusermediafailed", e)
        });
        this.rtcSession.on("accepted", function (e) {
            console.log("session.accepted", e);
            incomingCallAudio.pause();
            //setStatus("Call accepted");
            if (candidateTimeout != null) {
                clearTimeout(candidateTimeout);
            }
        });
        this.rtcSession.on("confirmed", function (e) {
            console.log("session.confirmed", e);
            //setConnectionActive();
        });
        this.rtcSession.on('onaddstream', function(e){
          // set remote audio stream (to listen to remote audio)
          // remoteAudio is <audio> element on page
          // // remoteAudio.src = window.URL.createObjectURL(e.stream);
          // // remoteAudio.play();
          console.log(e)
          var audio:any = document.getElementById('remoteAudio');
          audio.srcObject = e.stream;
          audio.play();
      });
        this.rtcSession.on('peerconnection', function (e) {
            console.log('session.peerconnection', e);
            const peerconnection = e.peerconnection;

            peerconnection.onaddstream = function (e) {
                console.log('peerconnection.onaddstream', e);
                //setStatus("Connecting audio...");
                remoteAudio.srcObject = e.stream;
                remoteAudio.play();
            };
        });
        this.rtcSession.on("connecting", function (e) {
            console.log("session.connecting", e)
        });
        this.rtcSession.on("sending", function (e) {
            console.log("session.sending", e)
        });
        this.rtcSession.on("progress", function (e) {
            console.log("session.progress", e)
        });
        //rtcSession.on("icecandidate", function (event) {
        //    console.log('session.icecandidate', event);
        //    if (event.candidate.type === "srflx" &&
        //        event.candidate.relatedAddress !== null &&
        //        event.candidate.relatedPort !== null) {
        //        event.ready();
        //    }
        //});
        var candidateTimeout = null;
        this.rtcSession.on('icecandidate', function (candidate, ready) {
            console.log('session.icecandidate', candidate);
            if (candidateTimeout != null) {
                clearTimeout(candidateTimeout);
            }
            // 1.5 seconds timeout after the last icecandidate received!
            //candidateTimeout = setTimeout(candidate.ready, 1500);
            candidateTimeout = setTimeout(this.forceCandidateReady, 1500, candidate);
        });



        if (this.rtcSession.direction === 'incoming') {
            try {
                incomingCallAudio.play();
            }
            catch (err) {
                console.error(err);
            }
        }

        //attempt auto-answer, but let it ring for half-sec...
        
      
      })
      setTimeout( ()=> { this.answerCall() }, 500);
      this.callOptions = {
        'eventHandlers'    : eventHandlers,
        mediaConstraints: { audio: true, video: false },
        rtcpMuxPolicy: "require",
        pcConfig:
        {
            iceServers:
                [
                    {
                        urls: ["stun:stun.l.google.com:19302"]
                    }
                ]
        }};
      
      var session = ua.call('0291125849', this.callOptions);
      
      // setTimeout(() => {
      //   console.log(session.status);

      // }, 1000); 
      //setInterval(()=> { this.printStatus(session.status+' '+session.direction);console.log('session->' ,session) },  10*1000);
    }
    
    forceCandidateReady(candidate) {
      console.log("candidateTimeout", candidate);
      candidate.ready();
  }
    printStatus(val)
    {
      console.log('Call Status',val);
      
    }
  logout(): void {
    this.oidc.logout();
  }
  
  hasMic=true;
  requestMic() {
    console.log('requestMic');
    //setStatus("Accessing microphone...");
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then(function (stream) {
            console.log("getUserMedia.stream", stream);
            //this.hasMic = true;
            //setStatus("Click to Connect");
        })
        .catch(function (err) {
            console.log("getUserMedia.err", err);
            //this.hasMic = false;
            //setError("Microphone access blocked");
        })
}

}
