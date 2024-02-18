import {Component, effect, Input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {
  ContentProfile,
  ContentProfileType,
  contentProfileTypeToHumanizedString
} from "../../../../shared/model/authenticable";
import {ContentService} from "../../../../shared/service/content.service";
import {FormsModule} from "@angular/forms";

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

  protected contentProfile: ContentProfile = {} as ContentProfile;
  @Input('profileSignal') public updateSignal: WritableSignal<ContentProfile> = signal({} as ContentProfile);
  protected staticProfileName = '';
  protected profileName: string = '';
  protected profileTypes = [ContentProfileType.PERSONAL, ContentProfileType.COMPANY, ContentProfileType.EDUCATIONAL, ContentProfileType.GUEST];
  protected selectedProfileType: ContentProfileType | undefined;

  constructor(private contentService: ContentService) {
    effect(() => {
      if (this.updateSignal) {
        if (this.contentProfile == this.updateSignal()) {
          return
        }
        this.contentProfile = this.updateSignal();
        this.profileName = this.staticProfileName = this.contentProfile?.name || '';
        console.log(this.contentProfile.contentProfileType);
        this.selectedProfileType = this.contentProfile.contentProfileType
      }
    }, {allowSignalWrites: true});
  }

  ngOnInit(): void {
    if (this.updateSignal != undefined) {
      this.contentProfile = this.updateSignal();
      this.profileName = this.staticProfileName = this.contentProfile?.name || '';
      this.selectedProfileType = this.contentProfile.contentProfileType
    }
  }

  protected readonly ContentProfileType = ContentProfileType;
  protected readonly contentProfileTypeToString = contentProfileTypeToHumanizedString;
}
