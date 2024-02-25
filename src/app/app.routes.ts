import {RouterModule, Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    title: 'Projects - marinus.dev',
    loadChildren: () => import('./../project/project.module')
      .then(mod => mod.ProjectModule),
  },
  {
  path : '**',
  loadChildren: () => import('./../terminal/terminal.module')
    .then(mod => mod.TerminalModule)
}];
