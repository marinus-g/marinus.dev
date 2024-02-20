import {Component, Input, signal} from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {

  @Input('autoclose') public autoclose = true;
  @Input('message') public message = '';
  @Input('title') public title = '';
  @Input('signal') public signal = signal(undefined);
}
