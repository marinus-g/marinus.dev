import {Component} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-projects',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit-projects.component.html',
  styleUrl: './edit-projects.component.css'
})
export class EditProjectsComponent {
  protected tag: string | undefined;
  protected thumbnailName: string = 'Choose a thumbnail';
  thumbnailType: string = '';
  thumbnail: string | undefined;
  thumbnailUrl: string | undefined;

  constructor(private projectService: ProjectService) {
  }

  createProjectTag(event: MouseEvent) {
    event.preventDefault()
    this.projectService.createProjectTag({
      tag: this.tag,
    }).then((response) => {
      console.log("response: ", response)
    })
  }

  protected onThumbnailSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        this.thumbnail = (target.result as string).split('base64,')[1];
      }
      reader.readAsDataURL(file);
    }
  }
}
