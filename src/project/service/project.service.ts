import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {ProjectTag} from "../model/project-tag";
import {ContentProfile} from "../../shared/model/authenticable";
import {END_POINT} from "../../util/consts";
import {firstValueFrom} from "rxjs";
import {ENV} from "../../environments/environment.provider";
import {Environment} from "../../environments/ienvironment";

@Injectable({
  providedIn: 'root',

})
export class ProjectService {


  constructor(private http: HttpClient, @Inject(ENV) private env: Environment) { }

  public async createProjectTag(projectTag: any) {
    const response$ = this.http.post<ProjectTag>(this.env.apiUrl + END_POINT.CREATE_PROJECT_TAG,
      projectTag,
      {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as ProjectTag;
  }
}
