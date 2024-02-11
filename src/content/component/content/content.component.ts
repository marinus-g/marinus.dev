import {Component, ElementRef, ViewChild} from '@angular/core';
import {DynamicComponent} from "../../../component/dynamic-component";
import {NgComponentOutlet} from "@angular/common";
import {WelcomeMessageContentComponent} from "./add-content/welcome-message/welcome-message.content.component";
import {CommandContentComponent} from "./add-content/command.content/command.content.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgComponentOutlet
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements DynamicComponent {

  protected contentTypeList = [ContentType.WELCOME, ContentType.COMMAND];
  protected _contentAddAddition: DynamicComponent | undefined = undefined;
  @ViewChild('contentTypeSelect') contentTypeSelect: ElementRef | undefined = undefined;
  public get contentAddAddition(): any {
    return this._contentAddAddition;
  }

  public set contentAddAddition(value: DynamicComponent | undefined) {
    this._contentAddAddition = value;
  }

  onContentTypeSelect() {
    if (this.contentTypeSelect !== undefined) {
      switch (this.contentTypeSelect.nativeElement.value) {
        case ContentType.WELCOME:
          this.contentAddAddition = WelcomeMessageContentComponent;
          break;
        case ContentType.COMMAND:
          this.contentAddAddition = CommandContentComponent;
          break;

      }
    }
  }
}

export enum ContentType {
  WELCOME = "Welcome Message",
  COMMAND = "Command",
}
