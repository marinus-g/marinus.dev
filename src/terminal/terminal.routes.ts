import {RouterModule, Routes} from "@angular/router";
import {TerminalComponent} from "./component/terminal.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: TerminalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalRoutingModule { }
