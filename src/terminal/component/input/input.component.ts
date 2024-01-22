import {AfterViewInit, Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {TerminalService} from "../../service/terminal.service";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements AfterViewInit{

  @ViewChild('input') inputField: ElementRef | undefined;

  protected commandInput: string = '';

  constructor(private terminalService: TerminalService) {
  }


  ngAfterViewInit() {
    this.inputField?.nativeElement.focus()
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (event.target === this.inputField?.nativeElement) {
      const inputElement = this.inputField.nativeElement as HTMLInputElement;
      if (inputElement.selectionStart !== inputElement.selectionEnd) {
        // User is selecting text, allow the default action
        return;
      }
      event.preventDefault();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent): void {
    setTimeout(() => this.inputField?.nativeElement.focus(), 1000);
  }
  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event) {
    if (event.target != this.inputField?.nativeElement) {
      return;
    }    event.preventDefault();
    console.log("pressed enter " + this.commandInput)
    if (this.commandInput.replace(/\s/g, '').length === 0) {
      this.terminalService.appendEmptyHistory()
      return;
    }
    this.terminalService.handleCommand(this.commandInput)
    this.commandInput = '';
  }
}
