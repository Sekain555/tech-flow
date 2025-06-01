import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuinventarioPage } from './menuinventario.page';

const routes: Routes = [
  {
    path: '',
    component: MenuinventarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuinventarioPageRoutingModule {}
