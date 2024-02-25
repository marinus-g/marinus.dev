import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {ProjectTag} from "../model/project-tag";
import {END_POINT} from "../../util/consts";
import {firstValueFrom} from "rxjs";
import {ENV} from "../../environments/environment.provider";
import {Environment} from "../../environments/ienvironment";
import {Project} from "../model/project";

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _projectTags: ProjectTag[] = [];
  private _projects: Project[] = [];

  constructor(private http: HttpClient, @Inject(ENV) private env: Environment) { }

  public async createProjectTag(projectTag: any) {
    const response$ = this.http.post<ProjectTag>(this.env.apiUrl + END_POINT.PROJECT_TAG,
      projectTag,
      {
      observe: 'response',
      withCredentials: true
    });
    const response = await firstValueFrom(response$);
    return response.body as ProjectTag;
  }

  public async deleteProjectTag(id: number) {
    const response$ = this.http.delete(this.env.apiUrl + END_POINT.PROJECT_TAG + '/' + id, {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    return response.status;
  }

  public async createProject(project: Project) {
    const response$ = this.http.post<Project>(this.env.apiUrl + END_POINT.PROJECT, project, {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    return response.body as Project;
  }

  public async uploadPicture(picture: File, ) {
    const formData = new FormData();
    formData.append('file', picture);
    const response$ = this.http.post<string>(this.env.apiUrl + END_POINT.PICTURE, formData,{observe: 'response', withCredentials: true, responseType: 'text' as 'json'});
    const response = await firstValueFrom(response$);
    console.log("response", response)
    return response.body as string;
  }

  get projectTags(): ProjectTag[] {
    return this._projectTags;
  }
  public async fetchProjectTags() {
    const response$ = this.http.get<ProjectTag[]>(this.env.apiUrl + END_POINT.FETCH_PROJECT_TAGS, {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    this._projectTags =  response.body as ProjectTag[];
  }

  public async fetchProjects() {
    const response$ = this.http.get<Project[]>(this.env.apiUrl + END_POINT.PROJECTS, {observe: 'response', withCredentials: true});
    const response = await firstValueFrom(response$);
    this._projects = (response.body as Project[]).sort((a, b) => b.difficulty - a.difficulty);
  }

  public async fetchPicture(thumbnailReference: string) {
    const response$ = this.http.get(this.env.apiUrl + END_POINT.PICTURE
      + thumbnailReference, {observe: 'response', withCredentials: true, responseType: 'arraybuffer' as 'json'});
    const response = await firstValueFrom(response$);
    return response.body as ArrayBuffer;
  }

  get projects(): Project[] {
    return this._projects;
  }


}
