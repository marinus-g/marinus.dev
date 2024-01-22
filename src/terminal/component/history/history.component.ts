import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {TerminalService} from "../../service/terminal.service";
import {History, HistoryType} from "../../model/history";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewChecked{

  @ViewChild('historyContainer') private historyContainer: ElementRef | undefined

  constructor(protected terminalService: TerminalService) {
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (!this.historyContainer)
      return
    this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
  }

  protected getSplittedOutput(history: History): string[] {
    return history.output.split("\n");
  }

  protected readonly HistoryType = HistoryType;
}
