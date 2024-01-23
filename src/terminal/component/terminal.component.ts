import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../service/terminal.service";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent {

  constructor(protected terminalService: TerminalService) { }

}
