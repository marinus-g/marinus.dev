import { Routes } from '@angular/router';
import {ProjectListComponent} from "../project/component/project-list/project-list.component";

export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () => import('./../project/project.module')
      .then(mod => mod.ProjectModule),
    component: ProjectListComponent
  },
  {
  path : '**',
  loadChildren: () => import('./../terminal/terminal.module')
    .then(mod => mod.TerminalModule)
}];
