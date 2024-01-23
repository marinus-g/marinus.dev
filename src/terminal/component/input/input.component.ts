import {AfterViewInit, Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {TerminalService} from "../../service/terminal.service";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements AfterViewInit {

  @ViewChild('input') inputField: ElementRef | undefined;

  public commandInput: string = "";

  constructor(protected terminalService: TerminalService) {
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
    setTimeout(() => this.inputField?.nativeElement.focus(), 100);
  }

  @HostListener('keydown.ArrowUp', ['$event'])
  onArrowUp(event: Event) {
    if (event.target != this.inputField?.nativeElement) {
      return;
    }
    event.preventDefault();
    if (this.terminalService.commandHistory.length === 0) {
      return;
    }
    if (this.terminalService.lastCommandIndex === -1) {
      this.terminalService.lastCommandIndex = this.terminalService.commandHistory.length;
    }
    this.terminalService.lastCommandIndex = Math.max(0, this.terminalService.lastCommandIndex - 1);

    this.commandInput = this.terminalService.commandHistory[this.terminalService.lastCommandIndex];
    if (this.inputField && this.inputField.nativeElement) {
      (this.inputField.nativeElement as HTMLInputElement).value = this.commandInput;
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event) {
    if (event.target != this.inputField?.nativeElement) {
      return;
    }
    event.preventDefault();
    if (this.commandInput == undefined || this.commandInput.replace(/\s/g, '').length === 0) {
      this.terminalService.appendEmptyHistory()
      return;
    }
    this.terminalService.handleCommand(this.commandInput)
    this.commandInput = '';
  }

  resetLastCommandIndex() {
    this.terminalService.lastCommandIndex = -1;
  }
}
