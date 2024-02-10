import {Injectable} from "@angular/core";
import {DynamicComponent} from "../component/dynamic-component";

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private _currentView: DynamicComponent | undefined = undefined;

  constructor() {
  }


  get currentView(): any | undefined {
    return this._currentView;
  }

  set currentView(value: DynamicComponent | undefined) {
    this._currentView = value;
  }

  public clearView(): void {
    this._currentView = undefined;
  }

  public isViewSet(): boolean {
    return this._currentView !== undefined;
  }
}
