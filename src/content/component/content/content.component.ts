import { Component } from '@angular/core';
import {DynamicComponent} from "../../../component/dynamic-component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements DynamicComponent {

  protected contentTypeList = [ContentType.WELCOME, ContentType.COMMAND];

}


export enum ContentType {
  WELCOME = "Welcome Message",
  COMMAND = "Command",
}
