import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RoomService } from './services/room.service';
import { RtcService } from './services/rtc.service';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';

// guards
import { AuthGuardService } from './guards/auth-guard.service';

// 3rd party
import {ShareButtonsModule} from 'ng2-sharebuttons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomIndexComponent } from './views/room-index/room-index.component';
import { RoomShowComponent } from './views/room-show/room-show.component';
import { RoomCreateComponent } from './views/room-create/room-create.component';
import { RoomEditComponent } from './views/room-edit/room-edit.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { YoutubeComponent } from './components/youtube/youtube.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomIndexComponent,
    RoomShowComponent,
    RoomCreateComponent,
    RoomEditComponent,
    HomeComponent,
    LoginComponent,
    YoutubeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ShareButtonsModule.forRoot(),
  ],
  providers: [
    RoomService,
    RtcService,
    AuthService,
    FirebaseService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
