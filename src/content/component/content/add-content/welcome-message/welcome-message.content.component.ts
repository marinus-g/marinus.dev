import { Component } from '@angular/core';
import {DynamicComponent} from "../../../../../component/dynamic-component";
import {ContentAddSection} from "../add-content.interface";

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [],
  templateUrl: './welcome-message.content.component.html',
  styleUrl: './welcome-message.content.component.css'
})
export class WelcomeMessageContentComponent implements DynamicComponent, ContentAddSection {

  constructor() {
  }

  canAdd(): boolean {
    return true;
  }

}
