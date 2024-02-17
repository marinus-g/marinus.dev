import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DynamicComponent} from "../../../../shared/component/dynamic-component";
import {ContentAddSection} from "../add-content.interface";
import {FormsModule} from "@angular/forms";
import {WelcomeMessagePreviewComponent} from "./welcome-message-preview/welcome-message-preview.component";
import {NgComponentOutlet} from "@angular/common";
import {ViewService} from "../../../../shared/service/view.service";
import {ContentService} from "../../../../shared/service/content.service";
import {WelcomeScreenContent, WelcomeScreenContentCreate} from "../../../../shared/model/content";
import {ContentComponent} from "../../content.component";

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
export class WelcomeMessageContentComponent implements DynamicComponent, ContentAddSection, OnInit {

  @Input('edit') public edit = false
  @Input('messages') public messages: string[] = [];
  @Input('id') public id = -1;
  @Input('name') public name: string = ''
  tempMessages: string[] = [];
  protected preview: any | undefined = undefined;
  protected showNameMissing: boolean = false;
  private previewTimeout: any | undefined = undefined;
  private previewHidingTimeout: any | undefined = undefined;
  private timeout: any | undefined = undefined;

  @ViewChild('previewButton') previewButton: ElementRef | undefined = undefined;

  constructor(private viewService: ViewService, private cdr: ChangeDetectorRef, private contentService: ContentService,
              private contentComponent: ContentComponent) {
  }

  ngOnInit() {
    this.messages.forEach(value => this.tempMessages.push(value))
  }

  submit() {
    if (this.name.trim().length == 0) { // If there´s no name entered we return
      if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
      }
      this.showNameMissing = true
      this.timeout = setTimeout(() => {
        this.showNameMissing = false
      }, 3000)
      return
    }

    if (this.edit) {
      const messageContent: WelcomeScreenContent = {
        content_type: "welcome_screen",
        id: this.id,
        name: this.contentComponent.getContentEditName(this.id),
        welcomeMessage: this.messages
      }
      this.contentService.editContent(messageContent).then(value => {
        this.contentComponent.removeFromEdit(this.id);
      })
    } else {
      const messageContent: WelcomeScreenContentCreate = {
        name: this.name.trim(),
        content_type: 'welcome_screen',
        welcomeMessage: this.messages
      }
      this.contentService.createContent(messageContent)
        .then((content) => {
          this.contentComponent.contentAddAddition = undefined;
          this.name = '';
          if (this.contentComponent.contentNameInput?.nativeElement) {
            this.contentComponent.contentNameInput.nativeElement.value = '';
          }
          if (this.contentComponent.contentTypeSelect?.nativeElement) {
            this.contentComponent.contentTypeSelect.nativeElement.value = '';
          }
        });
    }
  }

  canAdd(): boolean {
    return true;
  }


  onRemoveMessage(idx: number, event: MouseEvent) {
    event.preventDefault()
    this.messages.splice(idx, 1);
    this.tempMessages.splice(idx, 1);
  }

  onAddMessage() {
    this.messages.push('');
    this.tempMessages.push('');
  }

  onInputChange(idx: number) {
    this.messages[idx] = this.tempMessages[idx];
  }

  onPreviewStart() {
    this.viewService.previewPositionProperties = {
      top: '40%',
      left: '18%',
      width: '75%',
      height: '30%',
      opacity: '0'
    }
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
}
