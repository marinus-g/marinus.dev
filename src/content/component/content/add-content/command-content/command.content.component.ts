import { Component } from '@angular/core';
import {DynamicComponent} from "../../../../../shared/component/dynamic-component";
import {ContentAddSection} from "../add-content.interface";

@Component({
  selector: 'app-command-content',
  standalone: true,
  imports: [],
  templateUrl: './command.content.component.html',
  styleUrl: './command.content.component.css'
})
export class CommandContentComponent implements DynamicComponent, ContentAddSection{

  canAdd(): boolean {
    return true;
  }
}
