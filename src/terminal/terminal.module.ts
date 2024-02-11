import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ps1Component} from "./component/ps1/ps1.component";
import {InputComponent} from "./component/input/input.component";
import {HistoryComponent} from "./component/history/history.component";
import {TerminalComponent} from "./component/terminal.component";
import {TerminalRoutingModule} from "./terminal.routes";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DnsService} from "../service/dns.service";
import {TerminalService} from "../service/terminal.service";
import {LoadingComponent} from "./component/loading/loading.component";
import {AuthenticationService} from "../service/authentication.service";
import {ContentService} from "../service/content.service";
import {UserService} from "../service/user.service";
import {PasswordInputComponent} from "./component/input/password-input/password-input.component";
import {ViewService} from "../service/view.service";
import {ENV, getEnv} from "../environments/environment.provider";

@NgModule({
  declarations: [
    TerminalComponent,
    Ps1Component,
    InputComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    TerminalRoutingModule,
    FormsModule,
    HttpClientModule,
    LoadingComponent,
    PasswordInputComponent
  ],
  providers: [
    ViewService,
    TerminalService,
    UserService,
    ContentService,
    AuthenticationService,
    DnsService,
    {provide: ENV, useFactory: getEnv}
  ],
  exports: [
    TerminalComponent
  ]
})
export class TerminalModule {

  constructor() {
  }
}
