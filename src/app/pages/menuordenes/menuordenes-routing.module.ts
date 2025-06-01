import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuordenesPage } from './menuordenes.page';

const routes: Routes = [
  {
    path: '',
    component: MenuordenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuordenesPageRoutingModule {}
