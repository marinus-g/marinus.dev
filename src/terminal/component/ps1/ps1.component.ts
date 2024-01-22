import { Component } from '@angular/core';
import {TerminalService} from "../../service/terminal.service";

@Component({
  selector: 'app-ps1',
  templateUrl: './ps1.component.html',
  styleUrl: './ps1.component.css'
})
export class Ps1Component {

  constructor(protected terminalService: TerminalService) {

  }

}
