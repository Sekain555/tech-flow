import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuresumenPage } from './menuresumen.page';

const routes: Routes = [
  {
    path: '',
    component: MenuresumenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuresumenPageRoutingModule {}
