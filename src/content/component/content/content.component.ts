import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {DynamicComponent} from "../../../shared/component/dynamic-component";
import {NgComponentOutlet} from "@angular/common";
import {WelcomeMessageContentComponent} from "./add-content/welcome-message/welcome-message.content.component";
import {CommandContentComponent} from "./add-content/command.content/command.content.component";
import {ViewService} from '../../../shared/service/view.service';
import {FormsModule} from "@angular/forms";
import {ContentService} from "../../../shared/service/content.service";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FormsModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements DynamicComponent {

  protected contentTypeList = [ContentType.WELCOME, ContentType.COMMAND];
  protected _contentAddAddition: DynamicComponent | undefined = undefined;
  @ViewChild('contentNameInput') contentNameInput: ElementRef | undefined = undefined;
  @ViewChild('contentTypeSelect') contentTypeSelect: ElementRef | undefined = undefined;
  @ViewChild('contentWindow') contentWindow: ElementRef | undefined = undefined;
  @ViewChild('childComponent') childComponent: ElementRef | undefined = undefined;

  public get contentAddAddition(): any {
    return this._contentAddAddition;
  }

  constructor(private viewService: ViewService, protected contentService: ContentService) {
    this.contentService.fetchAll()
      .catch(reason => {
      console.error(reason)
    });
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

  onFormSubmit(event: Event) {
    event.preventDefault()
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.defaultPrevented) {
      return
    }
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.contentWindow?.nativeElement.contains(targetElement);
    const contentClickedInside = this.isClickedInside(this.childComponent?.nativeElement, targetElement);
    if (!clickedInside && !contentClickedInside) {
      this.viewService.clearView()
    }
  }


  isClickedInside(element: HTMLElement | undefined, targetElement: HTMLElement): boolean {

    if (!element) {
      return false;
    }

    if (element.contains(targetElement)) {
      return true;
    }
    for (let i = 0; i < element.children.length; i++) {
      if (this.isClickedInside(element.children[i] as HTMLElement, targetElement)) {
        return true;
      }
    }
    return false;
  }

  contentAddNameChange(event: Event) {
    this.contentService.contentAddName = (event.target as HTMLInputElement).value;
  }
}

export enum ContentType {
  WELCOME = "Welcome Message",
  COMMAND = "Command",
}
