import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuclientesPage } from './menuclientes.page';

const routes: Routes = [
  {
    path: '',
    component: MenuclientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuclientesPageRoutingModule {}
