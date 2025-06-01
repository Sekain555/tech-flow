import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroclientesPage } from './registroclientes.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroclientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroclientesPageRoutingModule {}
