import {Component, effect, ElementRef, Input, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {
  ContentProfileType,
  contentProfileTypeToHumanizedString
} from "../../../../shared/model/authenticable";
import {ContentService} from "../../../../shared/service/content.service";
import {FormsModule} from "@angular/forms";
import {ContentModel} from "../../../../shared/model/content";
import {ContentProfileContent} from "../../content.component";

@Component({
  selector: 'app-edit-content-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit-content-profile.component.html',
  styleUrl: './edit-content-profile.component.css'
})
export class EditContentProfileComponent implements OnInit {

  protected contentProfile: ContentProfileContent = {} as ContentProfileContent;
  @Input('profileSignal') public updateSignal: WritableSignal<ContentProfileContent | undefined> = signal(undefined);
  @Input('contentDragSignal') public contentDragSignal: WritableSignal<ContentModel | undefined> = signal(undefined);
  @ViewChild('dropZone') editElement: ElementRef | undefined = undefined;

  protected staticProfileName = '';
  protected blockSave = false;
  protected contentList: ContentModel[] = [];
  protected profileName: string = '';
  protected profileTypes = [ContentProfileType.PERSONAL, ContentProfileType.COMPANY, ContentProfileType.EDUCATIONAL, ContentProfileType.GUEST];
  protected selectedProfileType: ContentProfileType | undefined;
  protected guestUserName = '';
  private deleteContent = false;
  protected timeout = signal(-1);


  constructor(private contentService: ContentService) {
    effect(() => {
      if (this.timeout() == 0) {
        if (!this.deleteContent) {
          this.deleteContent = true;
          this.timeout.set(this.contentProfile.content.length);
          this.contentProfile.content.forEach((content) => {
            if (!this.contentList.find((c) => c.id == content.id)) {
              this.contentService.removeContentFromContentProfile(this.contentProfile.profile, content).then(value => {
                if (value == 200) {
                  this.contentProfile.content = this.contentProfile.content.filter((c) => c.id != content.id);
                  this.updateSignal.set(this.contentProfile);
                  this.timeout.update(value => value - 1);
                }
              });
            } else {
              this.timeout.update(value => value - 1);
            }
          });
          return;
        } else {
          this.deleteContent = false;
          this.blockSave = false;
        }
      }
      if (this.updateSignal) {
        if (this.contentProfile == this.updateSignal() || this.updateSignal() == undefined) {
          return
        }
        this.contentProfile = this.updateSignal() as ContentProfileContent;
        this.profileName = this.staticProfileName = this.contentProfile.profile.name || '';
        console.log(this.contentProfile.profile.contentProfileType);
        this.selectedProfileType = this.contentProfile.profile.contentProfileType;
        this.guestUserName = this.contentProfile.profile.guestUser.username || '';
        this.contentList = this.contentProfile.content;
      }
    }, {allowSignalWrites: true});
  }

  ngOnInit(): void {
    if (this.updateSignal != undefined && this.updateSignal() != undefined) {
      this.contentProfile = this.updateSignal() as ContentProfileContent;
      this.profileName = this.staticProfileName = this.contentProfile.profile.name || '';
      this.selectedProfileType = this.contentProfile.profile.contentProfileType
      this.guestUserName = this.contentProfile.profile.guestUser.username || '';
      this.contentList = [...this.contentProfile.content];
    }

    const dropZone = document.getElementById('drop-zone');
    if (dropZone == null)
      return
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.contentDragSignal != undefined && !this.contentList.find((content) => content.id == this.contentDragSignal()?.id)) {
        this.contentList.push(this.contentDragSignal() as ContentModel);
      }
      this.contentDragSignal.set(undefined);
    });
  }


  protected readonly ContentProfileType = ContentProfileType;
  protected readonly contentProfileTypeToString = contentProfileTypeToHumanizedString;

  protected saveProfile() {
    this.blockSave = true;
    this.contentProfile.profile.name = this.profileName;
    this.contentProfile.profile.contentProfileType = this.selectedProfileType || ContentProfileType.GUEST;
    this.contentProfile.profile.guestUser.username = this.guestUserName;
    this.timeout.set(this.contentList.length);
    console.log("hello x1")
    this.contentService.editContentProfile(this.contentProfile.profile).finally(() => {
      console.log("hello x2")
      this.timeout.set(this.contentList.length);
      this.contentList.forEach((content) => { // TODO REWRITE TO MASS UPDATE CONTENT
        console.log("hello x3", content.name)
        if (!this.containsContent(content)) {
          console.log("Adding content to profile")
          this.contentService.addContentToContentProfile(this.contentProfile.profile, content).then(value => {
            if (typeof value == 'number') {
              return;
            }
            this.timeout.update(value => value - 1);
            this.contentProfile.content.push(value as ContentModel);
            this.updateSignal.set(this.contentProfile);
          });
        } else {
          this.timeout.update(value => value - 1);
        }
      });

      this.updateSignal.set(this.contentProfile);
    });
  }

  private containsContent(content: ContentModel): boolean {
    console.log("Checking if content is in profile", this.contentProfile.content.find((c) => c.id == content.id));
    return this.contentProfile.content.find((c) => c.id == content.id) != undefined;
  }

  onRemoveContent(event: MouseEvent, content: ContentModel) {
    event.preventDefault()
    this.contentList = this.contentList.filter((c) => c.id != content.id);
  }
}
