import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoclientePage } from './nuevocliente.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoclientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoclientePageRoutingModule {}
