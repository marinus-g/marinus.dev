import {NgModule, SecurityContext} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ps1Component} from "./component/ps1/ps1.component";
import {InputComponent} from "./component/input/input.component";
import {HistoryComponent} from "./component/history/history.component";
import {TerminalComponent} from "./component/terminal.component";
import {TerminalRoutingModule} from "./terminal.routes";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {DnsService} from "./service/dns.service";
import {TerminalService} from "./service/terminal.service";
import {LoadingComponent} from "./component/loading/loading.component";
import {AuthenticationService} from "../shared/service/authentication.service";
import {ContentService} from "../shared/service/content.service";
import {UserService} from "../shared/service/user.service";
import {PasswordInputComponent} from "./component/input/password-input/password-input.component";
import {ViewService} from "../shared/service/view.service";
import {ENV, getEnv} from "../environments/environment.provider";
import {ProjectService} from "../project/service/project.service";
import {MarkdownComponent, MarkdownModule, MarkdownService, MARKED_OPTIONS, SECURITY_CONTEXT} from "ngx-markdown";

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
    MarkdownComponent,
    HttpClientModule,
    LoadingComponent,
    PasswordInputComponent,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          baseUrl: ' URL HERE '
        }
      }}),
  ],
  providers: [
    ViewService,
    ProjectService,
    TerminalService,
    UserService,
    ContentService,
    MarkdownService,
    AuthenticationService,
    DnsService,
    {provide: ENV, useFactory: getEnv},
    { provide: SECURITY_CONTEXT, useValue: SecurityContext.NONE },

  ],
  exports: [
    TerminalComponent
  ]
})
export class TerminalModule {

  constructor() {
  }
}
