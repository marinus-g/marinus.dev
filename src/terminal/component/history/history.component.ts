import {AfterViewChecked, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {TerminalService} from "../../../service/terminal.service";
import {HistoryType} from "../../../model/history";
import {History} from "../../../model/history";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewChecked {

  @ViewChild('historyContainer') private historyContainer: ElementRef | undefined

  constructor(protected terminalService: TerminalService, protected sanitizer: DomSanitizer) {

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    if (!this.historyContainer)
      return
    this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
  }

  getHistoryOutputAsString(history: History): string {
    if (typeof history.output === 'string') {
      return history.output;
    } else if (typeof history.output === 'function') {
      return history.output();
    } else return 'An error occurred!';
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  protected readonly HistoryType = HistoryType;
}
