import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectListComponent} from "./component/project-list/project-list.component";
import {FormsModule} from "@angular/forms";
import {UserService} from "../shared/service/user.service";
import {ContentService} from "../shared/service/content.service";
import {ProjectService} from "./service/project.service";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  id: "project",
  declarations: [ProjectListComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    ProjectService,
    ContentService
  ],
  exports: [ProjectListComponent]
})
export class ProjectModule { }
