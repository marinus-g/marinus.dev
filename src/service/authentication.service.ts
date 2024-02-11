import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContentProfile, RegisteredUser} from "../model/authenticable";
import {firstValueFrom} from "rxjs";
import {BACKEND, END_POINT} from "../util/consts";
import {Environment} from "../environments/ienvironment";
import {ENV} from "../environments/environment.provider";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, @Inject(ENV) private env: Environment) {
  }

  public async authenticate(data: AuthenticationData): Promise<ContentProfile | RegisteredUser | undefined> {
    const body = data.password == null ?
      {login: data.login, type: 'content'} : {login: data.login, password: data.password, type:'user'}
    const response$ = this.http.post<ContentProfile | RegisteredUser>(this.env.apiUrl + END_POINT.AUTHENTICATE + (data.password == null ? '?content=x' : ''),
      body, {observe: 'response', withCredentials: true});
    try {
      const response = await firstValueFrom(response$);
      return response.body as ContentProfile | RegisteredUser;
    } catch (error) {
      return undefined;
    }
  }

  public isContentProfileTokenSet(): boolean {
    return document.cookie.split(';').some((item) => item.trim().startsWith('token=1%%'));
  }

  public deleteContentProfileToken() {
    document.cookie = document.cookie.replace(/(token=1%%[^;]*;?)/, 'token=1%%=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
  }
  public deleteRegisteredUserToken() {
    document.cookie = document.cookie.replace(/(token=0%%[^;]*;?)/, 'token=0%%=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
  }
}

export interface AuthenticationData {
  login: string
  password: string | null
}
