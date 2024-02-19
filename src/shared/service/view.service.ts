import {Injectable} from "@angular/core";
import {DynamicComponent} from "../component/dynamic-component";

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private _currentView: DynamicComponent | undefined = undefined;
  private _previewPositionProperties: PreviewPositionProperties = {
    top: '25%',
    right: '10%',
    bottom: '25%',
    left: '25%',
    width: undefined,
    height: undefined
  };

  constructor() {
  }


  get previewPositionProperties(): PreviewPositionProperties {
    return this._previewPositionProperties;
  }

  set previewPositionProperties(value: PreviewPositionProperties) {
    this._previewPositionProperties = value;
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

export interface PreviewPositionProperties {
  top?: string,
  left?: string,
  right?: string,
  bottom?: string,
  width?: string | undefined,
  height?: string | undefined,
  opacity?: string | undefined
}
