import {AfterViewInit, Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {TerminalService} from "../../service/terminal.service";
import {ViewService} from "../../../shared/service/view.service";
import {ContentComponent} from "../../../content/component/content.component";
import {compareSegments} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker";
import {TerminalComponent} from "../terminal.component";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements AfterViewInit {

  @ViewChild('input') inputField: ElementRef | undefined;

  public commandInput: string = "";


  constructor(protected terminalService: TerminalService, private viewService: ViewService, private terminalComponent: TerminalComponent) {
  }


  ngAfterViewInit() {
    this.inputField?.nativeElement.focus()
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (this.viewService.isViewSet()) {
      return;
    }
    if (event.target instanceof HTMLElement && event.target.tagName === 'A'
      && event.target.getAttribute("href") != null) {
      if (!event.target.getAttribute('href')?.startsWith('mailto:')
        && !event.target.getAttribute('href')?.startsWith('http')) {
        return;
      }
      event.preventDefault()
      window.open(event.target.getAttribute('href') || '', '_blank');
      // Allow the default action for <a> tags
      return;
    }
    if (event.target === this.inputField?.nativeElement) {
      const inputElement = this.inputField.nativeElement as HTMLInputElement;
      if (inputElement.selectionStart !== inputElement.selectionEnd) {
        return;
      }
      event.preventDefault();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent): void {
    if (this.viewService.isViewSet()) {
      return;
    }
    setTimeout(() => this.inputField?.nativeElement.focus(), 50);
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

  @HostListener('keydown.ArrowDown', ['$event'])
  onArrowDown(event: Event) {
    if (event.target != this.inputField?.nativeElement) {
      return;
    }
    event.preventDefault();
    if (this.terminalService.commandHistory.length === 0) {
      return;
    }
    if (this.terminalService.lastCommandIndex === -1) {
      return;
    }
    this.terminalService.lastCommandIndex = Math.min(this.terminalService.commandHistory.length, this.terminalService.lastCommandIndex + 1);
    if (this.terminalService.lastCommandIndex === this.terminalService.commandHistory.length) {
      this.commandInput = '';
    } else {
      this.commandInput = this.terminalService.commandHistory[this.terminalService.lastCommandIndex];
    }
    if (this.inputField && this.inputField.nativeElement) {
      (this.inputField.nativeElement as HTMLInputElement).value = this.commandInput;
    }
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event) {
    if (event.target != this.inputField?.nativeElement) {
      console.log("return")
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

  @HostListener('keydown', ['$event'])
  onTabCompleteCommand(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }
}
