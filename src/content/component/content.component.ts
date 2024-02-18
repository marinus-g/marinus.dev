import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
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
import {ContentProfile, ContentProfileType} from "../../shared/model/authenticable";
import {EditContentProfileComponent} from "./profile/edit-content-profile/edit-content-profile.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FormsModule,
    WelcomeMessageContentComponent,
    EditContentProfileComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements DynamicComponent, OnInit {

  protected contentTypeList = [ContentSelectionType.WELCOME, ContentSelectionType.COMMAND];
  protected _contentAddAddition: DynamicComponent | undefined = undefined;
  private previewTimeout: any | undefined = undefined;
  private previewHidingTimeout: any | undefined = undefined;
  protected preview: any | undefined = undefined;
  protected contentEdit: number[] = [];
  private _contentProfileContentList: ContentProfileContent[] = [];
  protected contentAddName = ''
  protected contentProfileName = ''
  protected contentProfileUserName = ''
  protected showContentProfileNameOrUserNameMissing = false;
  protected showCreatedContentProfile = false;
  protected showContentProfileNameExists: boolean = false
  private showCreatedContentProfileTimeout: any | undefined = undefined;
  private contentProfileNameOrUserNameMissingTimeout: any | undefined = undefined;
  private contentProfileNameExistsTimeout: any | undefined = undefined;
  protected _editingContentProfile: ContentProfile | undefined = undefined;
  protected contentProfileSignal: WritableSignal<ContentProfile> = signal({} as ContentProfile);
  @ViewChild('contentNameInput') contentNameInput: ElementRef | undefined = undefined;
  @ViewChild('contentTypeSelect') contentTypeSelect: ElementRef | undefined = undefined;
  @ViewChild('contentWindow') contentWindow: ElementRef | undefined = undefined;
  @ViewChild('childComponent') childComponent: ElementRef | undefined = undefined;

  public get contentAddAddition(): any {
    return this._contentAddAddition;
  }

  constructor(private viewService: ViewService, protected contentService: ContentService, private cdr: ChangeDetectorRef) {

  }


  ngOnInit() {
    this.contentService.fetchAll().catch(reason => {
      console.error(reason);
    }).finally(() => {
      this.contentService.fetchAllProfiles()
        .then(value => {
          this._contentProfileContentList = [];
          this.contentService.contentProfileList.forEach(profile => {
            this.contentService.fetchContentForProfile(profile)
              .then(contentList => {
                this._contentProfileContentList.push({content: contentList, profile: profile});
              }).catch(reason => {
              console.error(reason);
            })
          })
        }).catch(reason => {
        console.error(reason);
      });
    })
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
    this.contentAddName = (event.target as HTMLInputElement).value;
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

  getContentProfileForId(contentProfile: ContentProfile) {
    return this._contentProfileContentList.find(profile => profile.profile.id === contentProfile.id);
  }

  removeFromEdit(id: number) {
    this.contentEdit.splice(this.contentEdit.indexOf(id), 1);
  }

  toWelcomeMessageContent(content: ContentModel) {
    return content as WelcomeScreenContent;
  }

  openContentEdit(profile: ContentProfile) {
    if (this._editingContentProfile === profile) {
      this._editingContentProfile = undefined;
      return;
    }
    this.contentProfileSignal.set(profile)
    this._editingContentProfile = profile;
    if (this._editingContentProfile !== undefined) {
      return;
    }
  }

  submitNewContentProfile() {
    if (this.contentProfileName === '' || this.contentProfileUserName === '') {
      this.showContentProfileNameOrUserNameMissing = true;
      if (this.contentProfileNameOrUserNameMissingTimeout !== undefined) {
        clearTimeout(this.contentProfileNameOrUserNameMissingTimeout);
      }
      this.contentProfileNameOrUserNameMissingTimeout = setTimeout(() => {
        this.showContentProfileNameOrUserNameMissing = false;
        this.contentProfileNameOrUserNameMissingTimeout = undefined;
      }, 5000);
      return;
    }
    this.contentService.createContentProfile({
      name: this.contentProfileName,
      guestUser: {
        username: this.contentProfileUserName,
        saveInLocalStorage: false
      },
      contentProfileType: ContentProfileType.GUEST
    }).then(value => {
      if (value === 200) {
        console.log("Content Profile Name Exists")
        this.showContentProfileNameExists = true;
        if (this.contentProfileNameExistsTimeout !== undefined) {
          clearTimeout(this.contentProfileNameExistsTimeout);
        }
        this.contentProfileNameExistsTimeout = setTimeout(() => {
          this.showContentProfileNameExists = false;
          this.contentProfileNameExistsTimeout = undefined;
        }, 5000);
        return;
      }
      if (typeof value === "number") {
        return;
      }
      const profile = value as ContentProfile;
      this.contentProfileName = '';
      this.contentProfileUserName = '';
      this._contentProfileContentList.push({content: [], profile: profile});
      this.contentService.contentProfileList.push(profile);
      if (this.showCreatedContentProfileTimeout !== undefined) {
        clearTimeout(this.showCreatedContentProfileTimeout);
      }
      this.showCreatedContentProfile = true;
      this.showCreatedContentProfileTimeout = setTimeout(() => {
        this.showCreatedContentProfile = false;
        this.showCreatedContentProfileTimeout = undefined;
      }, 5000);
    }).catch(reason => {
      console.error(reason);
    })
  }

  get contentProfileContentList(): ContentProfileContent[] {
    return this._contentProfileContentList;
  }
}

export enum ContentSelectionType {
  WELCOME = "Welcome Message",
  COMMAND = "Command",
}

interface ContentProfileContent {
  content: ContentModel[];
  profile: ContentProfile;
}

export enum ContentType {
  COMMAND = "command",
  WELCOME_SCREEN = "welcome_screen"
}
