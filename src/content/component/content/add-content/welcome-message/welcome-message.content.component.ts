import {ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {DynamicComponent} from "../../../../../component/dynamic-component";
import {ContentAddSection} from "../add-content.interface";
import {FormsModule} from "@angular/forms";
import {WelcomeMessagePreviewComponent} from "./welcome-message-preview/welcome-message-preview.component";
import {NgComponentOutlet} from "@angular/common";
import {ViewService} from "../../../../../service/view.service";

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
  private previewTimeout: any | undefined = undefined;
  private previewHidingTimeout: any | undefined = undefined;

  @ViewChild('previewButton') previewButton: ElementRef | undefined = undefined;

  constructor(private viewService: ViewService, private cdr: ChangeDetectorRef) {
  }

  canAdd(): boolean {
    return true;
  }


  onRemoveMessage(idx: number, event: MouseEvent) {
    console.log("remove message")
    console.log("event", event)
    event.preventDefault()
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
    this.viewService.previewPositionProperties = {
      top: '40%',
      left: '18%',
      width: '75%',
      height: '30%',
      opacity: '0'
    }

    console.log(this.viewService.previewPositionProperties)
    if (this.previewHidingTimeout !== undefined) {
      clearTimeout(this.previewHidingTimeout);
    } else {
      this.preview = WelcomeMessagePreviewComponent
    }
    this.previewTimeout = undefined
    this.previewTimeout = setTimeout(() => {
      this.viewService.previewPositionProperties = {
        top: '40%',
        left: '18%',
        width: '75%',
        height: '30%',
        opacity: '100'
      }
      this.cdr.detectChanges();
      this.previewTimeout = undefined
    }, 50);
  }

  onPreviewEnd() {
    if (this.previewTimeout !== undefined) {
      console.log("clear timeout")
      clearTimeout(this.previewTimeout);
    }
    this.viewService.previewPositionProperties = {
      top: '40%',
      left: '18%',
      width: '75%',
      height: '30%',
      opacity: '0'
    }
    this.previewHidingTimeout = setTimeout(() => {
      this.preview = undefined;
      this.previewHidingTimeout = undefined;
      this.cdr.detectChanges();
    }, 500);
  }

  isPreview() {
    return this.preview !== undefined;
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()

  }

  protected readonly console = console;
}
