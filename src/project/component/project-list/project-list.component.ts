import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {

  protected project: WritableSignal<Project | undefined> = signal(undefined)

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    console.log("Fetching projects")
    this.projectService.fetchProjects()
    .then(() => {
      if (this.projectService.projects.length > 0) {
        this.project.set(this.projectService.projects[0])
      }
    })
      .catch((error) => {
      console.error("Error fetching projects: ", error)
    });
  }
}
