import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContentProfile} from "../terminal/model/authenticable";
import {firstValueFrom} from "rxjs";
import {END_POINT} from "../util/consts";
import {TerminalService} from "./terminal.service";
import {Content, WelcomeScreenContent} from "../terminal/model/content";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private _contentProfile: ContentProfile | null = null;
  private _contentArray: Content[] = [];

  constructor(private http: HttpClient, private terminalService: TerminalService) {
    this.terminalService.contentService = this
  }

  public async getContentProfile(): Promise<ContentProfile> {
    const response$ = this.http.get<ContentProfile>(END_POINT.CONTENT_PROFILE, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);

    return response.body as ContentProfile;
  }


  public async getContent(): Promise<JSON> {
    const response$ = this.http.get<JSON>(END_POINT.CONTENT_FETCH, {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    return response.body as JSON;
  }

  public async getDefaultContent(): Promise<JSON> {
    const response$ = this.http.get<JSON>(END_POINT.DEFAULT_CONTENT, {observe: 'response'});
    const response = await firstValueFrom(response$);
    return response.body as JSON;
  }


  get contentProfile(): ContentProfile | null {
    return this._contentProfile;
  }

  set contentProfile(value: ContentProfile | null) {
    this._contentProfile = value;
    if (value != null) {
      if (value.themeDto != null) {
        this.terminalService.theme = value.themeDto;
      }
    }
  }

  parseJsonObject(jsonObject: JSON) {
    if (!jsonObject.hasOwnProperty("content_type")) {
      return;
    }
    const contentType = (jsonObject as any)["content_type"];
    if (contentType === "welcome_screen") {
      const welcomeScreenContent: WelcomeScreenContent = JSON.parse(JSON.stringify(jsonObject)) as WelcomeScreenContent;
      this._contentArray.push(welcomeScreenContent);
    }
  }

  getUserName(): string {
    return this._contentProfile ? this._contentProfile.guestUser.username :  "guest";
  }

  getWelcomeScreenContent(): WelcomeScreenContent[] {
    return this._contentArray.filter(value => value.content_type === "welcome_screen") as WelcomeScreenContent[];
  }

  get contentArray(): Content[] {
    return this._contentArray;
  }
}