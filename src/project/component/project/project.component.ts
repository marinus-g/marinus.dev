import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {Project} from "../../model/project";
import {ProjectService} from "../../service/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements AfterViewInit{

  @Input("project") project: WritableSignal<Project | undefined> = signal(undefined)
  @Input('hovering') hovering: WritableSignal<boolean> = signal(false)
  @Input('showingProject') showingProjectDescription: WritableSignal<boolean> = signal(false)
  @Input('arrowAction') arrowAction: WritableSignal<string> | undefined
  @ViewChild('projectImage') projectImage: ElementRef | undefined
  protected loaded: boolean = false;
  protected thumbnailUrl: string = "";
  protected showDescription: boolean = false;
  protected titleLeft: string = "-100%";
  protected maxImageWidth: number | string = "100%";
  protected descriptionTop: string = "100%";
  protected canHover: any;
  protected hideTitle: boolean = false;
  private displayingProject: boolean = false;
  protected projectTitle: string = '';
  protected hideGlow: boolean = false;


  constructor(private projectService: ProjectService, private renderer: Renderer2) {
    effect(() => {
      const project = this.project()
      if (project) {
        this.projectService.fetchPicture(project.thumbnailReference)
          .then((picture) => {
            const blob = new Blob([picture], {type: 'image/jpg'});
            let arrowAction: ArrowAction = ArrowAction.NEXT;
            if (this.arrowAction) {
              const [index, action] = this.arrowAction().split(';')
              switch (action) {
                case ArrowAction.NEXT:
                  arrowAction = ArrowAction.NEXT;
                  break;
                case ArrowAction.LAST:
                  arrowAction = ArrowAction.LAST;
                  break;
              }
            }
            this.canHover = false;
            this.loaded = true
            this.maxImageWidth = 0;
            setTimeout(() => {
              this.maxImageWidth = "100%";
              this.thumbnailUrl = URL.createObjectURL(blob);
              setTimeout(() => {
                this.canHover = true;
              }, 500);
            }, 500);
            if (this.displayingProject) {
              this.titleLeft = arrowAction == ArrowAction.NEXT ? "120%" : "-100%";
              setTimeout(() => {
                this.hideTitle = true;
                this.titleLeft = arrowAction == ArrowAction.NEXT ? "-100%" : "120%";
                this.projectTitle = project.name;
                setTimeout(() => {
                  this.hideTitle = false;
                  this.titleLeft = "0%";
                }, 20);
              }, 500);
            } else {
              this.projectTitle = project.name;
            }
          })
        this.displayingProject = true;
      }
    }, {allowSignalWrites: true})
  }

  ngAfterViewInit(): void {
    if (!this.projectImage) {
      return
    }
    this.renderer.listen(this.projectImage.nativeElement, 'wheel', (event) => {
      console.log('Element scrolled', event);
    });
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.canHover || this.showDescription ||  !this.project() || !this.loaded) {
      return
    }

    if (event.deltaY > 0) {
      this.nextProject()
    } else {
      this.lastProject()
    }
  }

  onShowDescription(event: MouseEvent) {
    if (event.defaultPrevented) {
      return
    }
    this.descriptionTop = "100%";
    this.showDescription = true;
    this.showingProjectDescription.set(true)
    setTimeout(() => {
      this.descriptionTop = "5%";
      setTimeout(() => {
        this.hideGlow = true;
      }, 350);
    }, 20);
  }

  onHideDescription($event: MouseEvent) {
    this.descriptionTop = '100%'
    this.hideGlow = false;
    setTimeout(() => {
        this.showDescription = false
        this.showingProjectDescription.set(false)
      }, 500)
  }

  protected nextProject() {
    if (this.arrowAction) {
      this.arrowAction.set(this.generateRandomChar() + ";" + ArrowAction.NEXT)
    }
  }

  protected lastProject() {
    if (this.arrowAction) {
      this.arrowAction.set(this.generateRandomChar() + ";" + ArrowAction.LAST)
    }
  }

  private generateRandomChar() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

}

export enum ArrowAction {
  NEXT = 'next',
  LAST = 'last'
}
