import {Component, effect, Input, OnInit, signal, WritableSignal} from '@angular/core';
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
  protected staticProfileName = '';
  protected contentList: ContentModel[] = [];
  protected profileName: string = '';
  protected profileTypes = [ContentProfileType.PERSONAL, ContentProfileType.COMPANY, ContentProfileType.EDUCATIONAL, ContentProfileType.GUEST];
  protected selectedProfileType: ContentProfileType | undefined;
  protected guestUserName = '';

  constructor(private contentService: ContentService) {
    effect(() => {
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
      this.contentList = this.contentProfile.content;
    }

    const dropZone = document.getElementById('drop-zone');
    if (dropZone == null)
      return
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.contentDragSignal != undefined && !this.contentProfile.content.find((content) => content.id == this.contentDragSignal()?.id)) {
        this.contentProfile.content.push(this.contentDragSignal() as ContentModel);
      }
      this.contentDragSignal.set(undefined);
    });
  }


  protected readonly ContentProfileType = ContentProfileType;
  protected readonly contentProfileTypeToString = contentProfileTypeToHumanizedString;
}
