import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContentProfile, ContentProfileCreateDto} from "../model/authenticable";
import {firstValueFrom} from "rxjs";
import {END_POINT} from "../../util/consts";
import {TerminalService} from "../../terminal/service/terminal.service";
import {Content, ContentCreateDto, ContentModel, WelcomeScreenContent} from "../model/content";
import {UserService} from "./user.service";
import {ENV} from "../../environments/environment.provider";
import {Environment} from "../../environments/ienvironment";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private _contentProfile: ContentProfile | null = null;
  private _contentArray: Content[] = [];
  private _contentList: ContentModel[] = [];
  private _contentProfileList: ContentProfile[] = []

  constructor(private http: HttpClient, private terminalService: TerminalService, private userService: UserService, @Inject(ENV) private env: Environment) {
  }

  public async getContentProfile(): Promise<ContentProfile> {
    const response$ = this.http.get<ContentProfile>(this.env.apiUrl + END_POINT.CONTENT_PROFILE, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);

    return response.body as ContentProfile;
  }


  public async getContent(): Promise<JSON> {
    const response$ = this.http.get<JSON>(this.env.apiUrl + END_POINT.CONTENT_FETCH, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as JSON;
  }

  public async createContent(content: ContentCreateDto): Promise<Content> {
    const response$ = this.http.post<Content>(this.env.apiUrl + END_POINT.CONTENT_CREATE, content, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as Content;
  }

  public async editContent(content: ContentModel): Promise<Content> {
    const response$ = this.http.put<ContentModel>(this.env.apiUrl + END_POINT.CONTENT_CREATE, content, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as ContentModel;
  }

  public async getDefaultContent(): Promise<JSON> {
    const response$ = this.http.get<JSON>(this.env.apiUrl + END_POINT.DEFAULT_CONTENT, {observe: 'response'});
    const response = await firstValueFrom(response$);
    return response.body as JSON;
  }

  public async fetchAll(): Promise<void> {
    const response$ = this.http.get<ContentModel[]>(this.env.apiUrl + END_POINT.CONTENT_FETCH_ALL, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    this._contentList = response.body as ContentModel[];
  }

  public async fetchAllProfiles() {
    const response$ = this.http.get<ContentProfile[]>(this.env.apiUrl + END_POINT.CONTENT_PROFILE_FETCH_ALL, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    this._contentProfileList = response.body as ContentProfile[];
  }

  public async fetchContentForProfile(contentProfile: ContentProfile) {
    const response$ = this.http.get<ContentModel[]>(this.env.apiUrl + END_POINT.CONTENT_FETCH + contentProfile.id, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as ContentModel[];
  }

  public async createContentProfile(contentProfile: ContentProfileCreateDto): Promise<ContentProfile | number> {
    const response$ = this.http.post<ContentProfile>(this.env.apiUrl + END_POINT.CONTENT_PROFILE, contentProfile, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    console.log("status: " + response.status)
    if (response.status == 200) {
      return 200;
    } else if (response.status != 201) {
      return response.status;
    }
    console.log("body: " + response.body)
    return response.body as ContentProfile;
  }

  public async editContentProfile(contentProfile: ContentProfile): Promise<ContentProfile | number> {
    const response$ = this.http.put<ContentProfile>(this.env.apiUrl + END_POINT.CONTENT_PROFILE, contentProfile, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    if (response.status != 200) {
      return response.status;
    }
    return response.body as ContentProfile;
  }

  public async addContentToContentProfile(contentProfile: ContentProfile, content: ContentModel): Promise<ContentModel | number> {
    const response$ = this.http.post<ContentModel>(this.env.apiUrl + END_POINT.CONTENT_PROFILE_ADD_CONTENT.replace("{profile}", String(contentProfile.id)).replace("{content}", String(content.id)), {}, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    if (response.status != 200) {
      return response.status;
    }
    return response.body as ContentModel;
  }

  public async removeContentFromContentProfile(contentProfile: ContentProfile, content: ContentModel): Promise<number> {
    const response$ = this.http.delete(this.env.apiUrl + END_POINT.CONTENT_PROFILE_ADD_CONTENT.replace("{profile}", String(contentProfile.id)).replace("{content}", String(content.id)), {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.status;
  }

  public async deleteContentProfile(contentProfile: ContentProfile): Promise<number> {
    const response$ = this.http.delete(this.env.apiUrl + END_POINT.CONTENT_PROFILE + contentProfile.id, {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.status;
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
    return this.userService.registeredUser != null ? this.userService.registeredUser.username : this._contentProfile && this.contentProfile?.guestUser ? this._contentProfile.guestUser.username : "guest";
  }

  getWelcomeScreenContent(): WelcomeScreenContent[] {
    return this._contentArray.filter(value => value.content_type === "welcome_screen") as WelcomeScreenContent[];
  }

  get contentArray(): Content[] {
    return this._contentArray;
  }


  get contentProfileList(): ContentProfile[] {
    return this._contentProfileList;
  }

  set contentProfileList(value: ContentProfile[]) {
    this._contentProfileList = value;
  }

  get contentList(): ContentModel[] {
    return this._contentList;
  }
}
