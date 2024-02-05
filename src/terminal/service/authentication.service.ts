import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContentProfile, RegisteredUser} from "../model/authenticable";
import {firstValueFrom} from "rxjs";
import {END_POINT} from "../../util/consts";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {

  }

  public async authenticate(data: AuthenticationData): Promise<ContentProfile | RegisteredUser | undefined> {
    const body = data.password == null ?
      {login: data.login, type: 'content'} : {login: data.login, password: data.password, type:'user'}
    const response$ = this.http.post<ContentProfile | RegisteredUser>(END_POINT.AUTHENTICATE + (data.password == null ? '?content=x' : ''),
      body, {observe: 'response', withCredentials: true});
    try {
      const response = await firstValueFrom(response$);
      return response.body as ContentProfile | RegisteredUser;
    } catch (error) {
      return undefined;
    }
  }
}

export interface AuthenticationData {
  login: string
  password: string | null
}
