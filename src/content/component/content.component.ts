import {ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {DynamicComponent} from "../../shared/component/dynamic-component";
import {NgComponentOutlet} from "@angular/common";
import {WelcomeMessageContentComponent} from "./add-content/welcome-message/welcome-message.content.component";
import {CommandContentComponent} from "./add-content/command-content/command.content.component";
import {ViewService} from '../../shared/service/view.service';
import {FormsModule} from "@angular/forms";
import {ContentService} from "../../shared/service/content.service";
import {
  WelcomeMessagePreviewComponent
} from "./add-content/welcome-message/welcome-message-preview/welcome-message-preview.component";
import {ContentModel, WelcomeScreenContent} from "../../shared/model/content";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FormsModule,
    WelcomeMessageContentComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements DynamicComponent {

  protected contentTypeList = [ContentSelectionType.WELCOME, ContentSelectionType.COMMAND];
  protected _contentAddAddition: DynamicComponent | undefined = undefined;
  private previewTimeout: any | undefined = undefined;
  private previewHidingTimeout: any | undefined = undefined;
  protected preview: any | undefined = undefined;
  protected contentEdit: number[] = [];
  protected contentAddName = ''
  @ViewChild('contentNameInput') contentNameInput: ElementRef | undefined = undefined;
  @ViewChild('contentTypeSelect') contentTypeSelect: ElementRef | undefined = undefined;
  @ViewChild('contentWindow') contentWindow: ElementRef | undefined = undefined;
  @ViewChild('childComponent') childComponent: ElementRef | undefined = undefined;

  public get contentAddAddition(): any {
    return this._contentAddAddition;
  }

  constructor(private viewService: ViewService, protected contentService: ContentService,  private cdr: ChangeDetectorRef) {
    this.contentService.fetchAll()
      .catch(reason => {
      console.error(reason)
    });
  }


  public set contentAddAddition(value: DynamicComponent | undefined) {
    this._contentAddAddition = value;
  }

  onContentTypeSelect() {
    if (this.contentTypeSelect !== undefined) {
      switch (this.contentTypeSelect.nativeElement.value) {
        case ContentSelectionType.WELCOME:
          this.contentAddAddition = WelcomeMessageContentComponent;
          break;
        case ContentSelectionType.COMMAND:
          this.contentAddAddition = CommandContentComponent;
          break;
      }
    }
  }

  selectedContentType() {
    return this.contentTypeSelect?.nativeElement.value;
  }

  onFormSubmit(event: Event) {
    event.preventDefault()
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.defaultPrevented) {
      return
    }
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.contentWindow?.nativeElement.contains(targetElement);
    const contentClickedInside = this.isClickedInside(this.childComponent?.nativeElement, targetElement);
    if (!clickedInside && !contentClickedInside) {
      this.viewService.clearView()
    }
  }


  isClickedInside(element: HTMLElement | undefined, targetElement: HTMLElement): boolean {

    if (!element) {
      return false;
    }

    if (element.contains(targetElement)) {
      return true;
    }
    for (let i = 0; i < element.children.length; i++) {
      if (this.isClickedInside(element.children[i] as HTMLElement, targetElement)) {
        return true;
      }
    }
    return false;
  }

  contentAddNameChange(event: Event) {
    this.contentAddName =  (event.target as HTMLInputElement).value;
  }

  onPreviewStart(content: ContentModel) {
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

  protected readonly ContentType = ContentType;
  protected readonly ContentSelectionType = ContentSelectionType;

  getContentEditName(id: number) {
    const content = this.contentService.contentList.find(content => content.id === id);
    if (content) {
      return content.name;
    }
    return ''
  }

  removeFromEdit(id: number) {
    this.contentEdit.splice(this.contentEdit.indexOf(id), 1);
  }

  toWelcomeMessageContent(content: ContentModel) {
    return content as WelcomeScreenContent;
  }
}

export enum ContentSelectionType {
  WELCOME = "Welcome Message",
  COMMAND = "Command",
}

export enum ContentType {
  COMMAND = "command",
  WELCOME_SCREEN = "welcome_screen"
}
