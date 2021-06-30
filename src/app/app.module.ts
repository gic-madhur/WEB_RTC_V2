import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JssipWssConnectComponent } from './jssip-wss-connect/jssip-wss-connect.component';
import { WebrtcTestComponent } from './webrtc-test/webrtc-test.component';

@NgModule({
  declarations: [
    AppComponent,
    JssipWssConnectComponent,
    WebrtcTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
