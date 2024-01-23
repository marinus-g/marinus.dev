import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ps1Component} from "./component/ps1/ps1.component";
import {InputComponent} from "./component/input/input.component";
import {HistoryComponent} from "./component/history/history.component";
import {TerminalComponent} from "./component/terminal.component";
import {TerminalRoutingModule} from "./terminal.routes";
import {FormsModule} from "@angular/forms";

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
    FormsModule
  ],
  exports: [
    TerminalComponent
  ]
})
export class TerminalModule {

  constructor() {
  }
}
