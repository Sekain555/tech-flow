import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuresumentecPage } from './menuresumentec.page';

const routes: Routes = [
  {
    path: '',
    component: MenuresumentecPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuresumentecPageRoutingModule {}
