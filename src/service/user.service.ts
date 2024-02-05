import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {END_POINT} from "../util/consts";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public async isUserExist(username: string): Promise<boolean> {
    const response$ = this.http.get<boolean>(END_POINT.USER_EXISTS.replace("{username}", username), {observe: 'response'});
    const response = await firstValueFrom(response$)
    return response.body as boolean;
  }
}
