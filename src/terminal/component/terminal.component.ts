import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {TerminalService} from "../service/terminal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../shared/service/authentication.service";
import {ContentService} from "../../shared/service/content.service";
import {Subscription} from "rxjs";
import {ViewService} from "../../shared/service/view.service";
import {ENV} from "../../environments/environment.provider";
import {Environment} from "../../environments/ienvironment";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit {


  private _loading: boolean = true;
  private subscription: Subscription | null = null;


  constructor(protected terminalService: TerminalService, protected route: ActivatedRoute, private router: Router,
              private authService: AuthenticationService, private contentService: ContentService,
              protected viewService: ViewService,  @Inject(ENV) private env: Environment) {
  }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params['content'] != null) {
        this.authService.authenticate({login: params['content'], password: null}).finally(() => {
          if (this.subscription != null) {
            this.subscription.unsubscribe();
          }
          this.router.navigate([], {queryParams: {content: null}, queryParamsHandling: 'merge'})
            .finally(() => {
              this.init()
            })
        })
        return
      }
      this.init()
    })
  }

  private init() {
    if (this.authService.isContentProfileTokenSet()) {
      this.contentService.getContentProfile()
        .then(value => {
          this.contentService.contentProfile = value;
        })
        .finally(() => {
          this.loadContentProfile(300)
        })
      return
    } else {
      this.authService.deleteRegisteredUserToken();
    }
    this.loadContentProfile(this.env.production == false ? 100 : 500)
  }

  private loadContentProfile(delay: number) {
    const contentPromise: Promise<JSON> = this.contentService.contentProfile == null ? this.contentService.getDefaultContent() : this.contentService.getContent();
    contentPromise.then(json => {
      for (let valueKey in json) {
        if (json.hasOwnProperty(valueKey)) {
          const valueElement =  (json as any)[valueKey];
          this.contentService.parseJsonObject(valueElement)
        }
      }
    })
      .finally(() => {
        this.terminalService.contentService = this.contentService;
        this.terminalService.init(this.contentService)
        setTimeout(() => {
          this._loading = false;
          this.handleDevelopmentEnvironment()
        }, delay)
      })
  }

  private handleDevelopmentEnvironment() {
    if (!this.env.production) {
      this.terminalService.userToChangeTo = "root"
      this.terminalService.handlePasswordInput("123")
      setTimeout(() => {
        this.terminalService.handleCommand("projects").catch(reason => {
          console.error(reason)
        })
      }, 4500)
    }
  }

  get loading(): boolean {
    return this._loading;
  }
}
