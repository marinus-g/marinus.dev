import {NgModule, SecurityContext} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {UserService} from "../shared/service/user.service";
import {ContentService} from "../shared/service/content.service";
import {ProjectService} from "./service/project.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { ProjectListComponent } from './component/project-list/project-list.component';
import {ProjectRoutingModule} from "./project.routes";
import {ENV, getEnv} from "../environments/environment.provider";
import {ProjectComponent} from "./component/project/project.component";
import {MarkdownService, SECURITY_CONTEXT} from "ngx-markdown";

@NgModule({
  declarations: [
    ProjectListComponent
  ],
  imports: [
    ProjectRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ProjectComponent,
  ],
  providers: [
    ProjectService,
    UserService,
    ContentService,
    MarkdownService,
    {provide: ENV, useFactory: getEnv},
    { provide: SECURITY_CONTEXT, useValue: SecurityContext.NONE },


  ],
  exports: [ProjectListComponent]
})
export class ProjectModule {
  constructor() {
    console.log("ProjectModule")
  }
}
