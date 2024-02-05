import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TerminalService} from "../../../../service/terminal.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgStyle
  ],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent implements AfterViewInit {
  @ViewChild('input') inputField: ElementRef | undefined;
  private input = "";

  constructor(protected terminalService: TerminalService) {
  }


  ngAfterViewInit(): void {
    this.inputField?.nativeElement.focus()
    this.inputField?.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault()
      if (event.key === "Enter") {
        this.terminalService.handlePasswordInput(this.input)
        this.input = ""
        return
      } else if (event.key === "Backspace") {
        this.input = this.input.slice(0, -1)
      } else {
        if (!event.key.match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]$/)) {
          return
        }
        this.input += event.key
      }
    })
  }
}
