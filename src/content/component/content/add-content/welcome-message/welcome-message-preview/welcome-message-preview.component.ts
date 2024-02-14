import {Component} from '@angular/core';
import {TerminalService} from "../../../../../../service/terminal.service";
import {NgForOf, NgStyle} from "@angular/common";
import {WelcomeMessageContentComponent} from "../welcome-message.content.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ViewService} from "../../../../../../service/view.service";

@Component({
  selector: 'app-welcome-message-preview',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './welcome-message-preview.component.html',
  styleUrl: './welcome-message-preview.component.css'
})
export class WelcomeMessagePreviewComponent {

  constructor(protected terminalService: TerminalService,
              protected welcomeMessageContent: WelcomeMessageContentComponent, protected sanitizer: DomSanitizer,
              protected viewService: ViewService) {

  }

  getMessages() {
    return this.welcomeMessageContent.tempMessages;
  }

  buildInlineHtml(html: string) {

    let regex = /\{\[\{(.+?)\}\]\}/g;
    return html.replace(regex, (match) => {
      let textInsideBrackets = match.slice(3, -3);
      let replacement;
      switch (textInsideBrackets) {
        case "terminal#informationColor":
          replacement = this.terminalService.theme.terminal.informationColor;
          break;
        case "terminal#primaryColor":
          replacement = this.terminalService.theme.terminal.primaryColor;
          break;
        case "terminal#highlightColor":
          replacement = this.terminalService.theme.terminal.highlightColor;
          break
        case "terminal#warningColor":
          replacement = this.terminalService.theme.terminal.warningColor;
          break;
        case "terminal#backgroundColor":
          replacement = this.terminalService.theme.terminal.backgroundColor;
          break;
        case "terminal#clickableColor":
          replacement = this.terminalService.theme.terminal.clickableColor;
          break;
        default:
          replacement = "unknown";
      }
      return replacement;
    });
  }
}
