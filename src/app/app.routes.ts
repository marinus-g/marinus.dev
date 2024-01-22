import { Routes } from '@angular/router';

export const routes: Routes = [{
  path : '',
  loadChildren: () => import('./../terminal/terminal.module')
    .then(mod => mod.TerminalModule)
}];
