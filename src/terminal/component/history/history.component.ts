import {AfterViewChecked, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {TerminalService} from "../../service/terminal.service";
import {HistoryType} from "../../model/history";
import {History} from "../../model/history";
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewChecked, OnInit {

  @ViewChild('historyContainer') private historyContainer: ElementRef | undefined
  private tries = 0;

  constructor(protected terminalService: TerminalService, protected sanitizer: DomSanitizer) {

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.checkForProjectsLink();
  }

  private checkForProjectsLink() {
    const projectsButton = document.getElementById('projects-link');
    if (projectsButton != null) {
      console.log("Found projects link")
      projectsButton.addEventListener('click', () => {
        console.log("Open projects")
      });
      //projectsButton.onclick = this.openProjects;
    //  projectsButton.addEventListener('click', this.openProjects);
    } else {
      if (this.tries == 4) { // history should be loaded by now
        return;
      }
      setTimeout(this.checkForProjectsLink, 500);
      this.tries++
    }
  }

  scrollToBottom(): void {
    if (!this.historyContainer)
      return
    this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
  }

  openProjects(event: MouseEvent): void {
    console.log("Open projects")
    event.preventDefault();
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
