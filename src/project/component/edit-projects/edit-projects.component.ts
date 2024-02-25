import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {FormsModule} from "@angular/forms";
import {MarkdownComponent, MarkdownService} from "ngx-markdown";
import {Project} from "../../model/project";

@Component({
  selector: 'app-edit-projects',
  standalone: true,
  imports: [
    FormsModule,
    MarkdownComponent
  ],
  providers: [
    MarkdownService
  ],
  templateUrl: './edit-projects.component.html',
  styleUrl: './edit-projects.component.css'
})
export class EditProjectsComponent implements OnInit {
  protected tag: string | undefined;
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

  constructor(protected projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.fetchProjectTags().catch((error) => {
      console.error("Error fetching project tags: ", error)
    });
  }

  createProjectTag(event: MouseEvent) {
    event.preventDefault()
    this.projectService.createProjectTag({
      tag: this.tag,
    }).finally(() => {
      this.projectService.fetchProjectTags().catch((error) => {
        console.error("Error fetching project tags: ", error)
      })
    })
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

  deleteProjectTag(id: number) {
    this.projectService.deleteProjectTag(id).finally(() => {
      this.projectService.fetchProjectTags().catch((error) => {
        console.error("Error fetching project tags: ", error)
      })
    })
  }

  createProject() {
    if (!this.thumbnail || !this.projectDescription || !this.projectLink || !this.projectName) {
      console.log("Please fill out all fields", this.thumbnail, this.projectDescription, this.projectLink)
      window.alert("Please fill out all fields")
      return
    }
    let name = this.thumbnailFile?.name;
    if (!name) {
      name = "image.png";
    }

    if (this.thumbnailType == 'file') {
      const blob = this.base64ToBlob(this.thumbnail, "image/" + name.split(".")[name.split(".").length - 1]); // Replace 'image/png' with the correct MIME type if necessary
      const thumbnailFile = new File([blob], name, {type:"image/" + name.split(".")[name.split(".").length - 1]});
      this.projectService.uploadPicture(thumbnailFile)
        .then((thumbnailId) => {
          console.log("thumbnailId", thumbnailId)
          const project: Project = {
            id: undefined,
            thumbnailReference: thumbnailId,
            name: this.projectName,
            projectDescription: {
              markdown: this.projectDescription
            },
            link: this.projectLink,
            difficulty: this.difficulty
          }
          this.projectService.createProject(project)
            .then(() => {
              this.projectName = '';
              this.projectDescription = '';
              this.projectLink = '';
              this.difficulty = 1;
              this.thumbnail = '';
              this.thumbnailName = 'Choose a thumbnail';
              this.thumbnailType = '';
              this.thumbnailFile = undefined;
            })
            .finally(() => {
            this.projectService.fetchProjectTags().catch((error) => {
              console.error("Error fetching project tags: ", error)
            })
          })
        })
        .catch((error) => {
      })
    }
  }

  private base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
