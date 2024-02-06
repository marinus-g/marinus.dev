import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {END_POINT} from "../util/consts";
import {firstValueFrom} from "rxjs";
import {RegisteredUser} from "../terminal/model/authenticable";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _registeredUser: RegisteredUser | null = null;
  constructor(private http: HttpClient) { }

  public async isUserExist(username: string): Promise<boolean> {
    const response$ = this.http.get<boolean>(END_POINT.USER_EXISTS.replace("{username}", username), {observe: 'response'});
    const response = await firstValueFrom(response$)
    return response.body as boolean;
  }

  get registeredUser(): RegisteredUser | null {
    return this._registeredUser;
  }

  set registeredUser(value: RegisteredUser | null) {
    this._registeredUser = value;
  }

  public async updaterRegisteredUser(): Promise<void> {
    const response$ = this.http.get<RegisteredUser>(END_POINT.CURRENT_USER,
      {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    this.registeredUser = response.body as RegisteredUser;
  }
}

