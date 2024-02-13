import {Component} from '@angular/core';
import {DynamicComponent} from "../../../../../component/dynamic-component";
import {ContentAddSection} from "../add-content.interface";
import {FormsModule} from "@angular/forms";
import {WelcomeMessagePreviewComponent} from "./welcome-message-preview/welcome-message-preview.component";
import {NgComponentOutlet} from "@angular/common";

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [
    FormsModule,
    NgComponentOutlet
  ],
  templateUrl: './welcome-message.content.component.html',
  styleUrl: './welcome-message.content.component.css'
})
export class WelcomeMessageContentComponent implements DynamicComponent, ContentAddSection {

  protected messages: string[] = [];
  tempMessages: string[] = [];
  protected preview: any | undefined = undefined;
  constructor() {
  }

  canAdd(): boolean {
    return true;
  }


  onRemoveMessage(idx: number) {
    this.messages.splice(idx, 1);
    this.tempMessages.splice(idx, 1);
  }

  onAddMessage() {
    console.log("add message")
    this.messages.push('');
    this.tempMessages.push('');
  }

  onInputChange(idx: number) {
    this.messages[idx] = this.tempMessages[idx];
  }

  onPreviewStart() {
    console.log("preview start")
    this.preview = WelcomeMessagePreviewComponent
  }

  onPreviewEnd() {
    console.log("preview end")
    this.preview = undefined
  }

  isPreview() {
    return this.preview !== undefined;
  }
}
