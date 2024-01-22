import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../service/terminal.service";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit {

  constructor(protected terminalService: TerminalService) { }

  ngOnInit() {
    console.log("Hello World!");
  }
}
