import {Component, effect, Input, signal, WritableSignal} from '@angular/core';
import {Project} from "../../model/project";
import {FormsModule} from "@angular/forms";
import {MarkdownComponent} from "ngx-markdown";
import {ProjectService} from "../../service/project.service";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    FormsModule,
    MarkdownComponent
  ],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css', "./../edit-projects/edit-projects.component.css"]
})
export class EditProjectComponent {

  @Input('project') project: WritableSignal<Project | undefined> = signal(undefined)

  protected thumbnailName: string = 'Choose a thumbnail';
  protected thumbnailType: string = '';
  protected thumbnail: string | undefined;
  protected thumbnailUrl: string | undefined;
  protected projectDescription: string = '';
  protected showPreview: boolean = false;
  protected projectLink: string = '';
  protected difficulty: number = 1;
  protected projectName: string = '';
  protected imageType: string = '';
  protected thumbnailFile: File | undefined;

  constructor(private projectService: ProjectService) {
    effect(() => {
      const project = this.project()
      if (project) {
        this.projectName = project.name;
        this.projectDescription = project.projectDescription.markdown;
        this.projectLink = project.link;
        this.difficulty = project.difficulty;
        this.projectService.fetchPicture(project.thumbnailReference).then((picture => {
          const blob = new Blob([picture], {type: 'image/jpg'});
          this.thumbnailUrl = URL.createObjectURL(blob);
          this.urlToBase64(this.thumbnailUrl).then((base64) => {
            this.thumbnail = base64.split('base64,')[1];
          })
        }));
      }
    }, {allowSignalWrites: true});
  }

  private async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  protected onThumbnailSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      this.imageType = file.type;
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        this.thumbnailFile = file;
        this.thumbnail = (target.result as string).split('base64,')[1];
      }
      reader.readAsDataURL(file);
    }
  }

  protected saveProject() {
    const project = this.project()
    if (project && this.thumbnail) {
      let name = this.thumbnailFile?.name;
      if (!name) {
        name = "image.png";
      }
      const blob = this.base64ToBlob(this.thumbnail, "image/jpg" + name.split(".")[name.split(".").length - 1]); // Replace 'image/png' with the correct MIME type if necessary
      const thumbnailFile = new File([blob], name, {type: "image/jpg" + name.split(".")[name.split(".").length - 1]});
      this.projectService.uploadPicture(thumbnailFile).then((thumbnailReference) => {
        console.log("THEN")
        project.name = this.projectName;
        project.projectDescription.markdown = this.projectDescription;
        project.link = this.projectLink;
        project.difficulty = this.difficulty;
        project.thumbnailReference = thumbnailReference;
        this.projectService.updateProject(project).then(() => {
          this.project.set(undefined);
        });
      });
    }
  }

  private base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: contentType});
  }
}
