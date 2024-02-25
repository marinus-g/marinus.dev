import {Component, effect, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project";
import {ArrowAction} from "../project/project.component";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {

  protected project: WritableSignal<Project | undefined> = signal(undefined)
  protected hovering: WritableSignal<boolean> = signal(false)
  protected showingProjectDescription: WritableSignal<boolean> = signal(false)
  protected arrowAction: WritableSignal<string> = signal('unknown;0')
  private lastValue = '';
  private currentProjectIndex = 0;
  private switchProjectsTimer: any;
  constructor(private projectService: ProjectService) {
    effect(() => {
      if (this.arrowAction() !== this.lastValue) {
        this.lastValue = this.arrowAction();
        const [index, action] = this.arrowAction().split(';')
        console.log("Arrow action: ", action, index)
        if (action === ArrowAction.NEXT) {
          this.nextProject()
        } else if (action === ArrowAction.LAST) {
          this.lastProject()
        }
      }
    }, {allowSignalWrites: true});
  }

  ngOnInit(): void {
    console.log("Fetching projects")
    this.projectService.fetchProjects()
      .then(() => {
        if (this.projectService.projects.length > 0) {
          this.project.set(this.projectService.projects[this.currentProjectIndex])
        }
      })
      .catch((error) => {
        console.error("Error fetching projects: ", error)
      });
    this.switchProject();
  }

  private switchProject() {
    this.switchProjectsTimer = setTimeout(() => {
      this.switchProject();
      if (this.hovering() || this.showingProjectDescription()) {
        console.log("Hovering or showing project, not switching", this.hovering(), this.showingProjectDescription())
        return;
      }
      if (this.hasNextProject()) {
        this.nextProject()
      } else if (this.hasLastProject()) {
        this.lastProject()
      }
    }, 15_000);
  }

  protected nextProject() {
    if (!this.hasNextProject()) {
      this.currentProjectIndex = -1;
    }
    clearTimeout(this.switchProjectsTimer)
    this.project.set(this.projectService.projects[++this.currentProjectIndex]);
    this.switchProject()
  }

  protected lastProject() {
    if (!this.hasLastProject()) {
      this.currentProjectIndex = this.projectService.projects.length;
    }
    clearTimeout(this.switchProjectsTimer)
    this.project.set(this.projectService.projects[--this.currentProjectIndex]);
    this.switchProject()
  }

  protected hasNextProject() {
    return this.currentProjectIndex < this.projectService.projects.length - 1;
  }

  protected hasLastProject() {
    return this.currentProjectIndex > 0;
  }
}
