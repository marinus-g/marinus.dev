import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../service/terminal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {ContentService} from "../service/content.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit {


  private _loading: boolean = true;
  private subscription: Subscription | null = null;

  constructor(protected terminalService: TerminalService, protected route: ActivatedRoute, private router: Router,
              private authService: AuthenticationService, private contentService: ContentService) {
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
    this.contentService.getContentProfile()
      .then(value => {
        this.contentService.contentProfile = value;
      })
      .finally(() => {
        this.contentService.getContent().then(json => {
          for (let valueKey in json) {
            if (json.hasOwnProperty(valueKey)) {
              const valueElement =  (json as any)[valueKey];
              this.contentService.parseJsonObject(valueElement)
            }
          }
        })
          .finally(() => {
            this.terminalService.init(this.contentService)
            setTimeout(() => {
              this._loading = false;
            }, 100)
          })
      })
  }

  get loading(): boolean {
    return this._loading;
  }
}
