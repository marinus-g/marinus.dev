import {Component, effect, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {Project} from "../../model/project";
import {ProjectService} from "../../service/project.service";
import {NgOptimizedImage} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MarkdownComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  @Input("project") project: WritableSignal<Project | undefined> = signal(undefined)
  protected loaded: boolean = false;
  protected thumbnailUrl: string = "";
  protected showDescription: boolean = false;

  constructor(private projectService: ProjectService) {
    effect(() => {
      const project = this.project()
      if (project) {
        this.projectService.fetchPicture(project.thumbnailReference)
          .then((picture) => {
            const blob = new Blob([picture], {type: 'image/jpg'});
            this.thumbnailUrl = URL.createObjectURL(blob);
            this.loaded = true
            console.log("loaded: ", this.loaded)
          })
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
   console.log("Project: ", this.project)
  }
}
