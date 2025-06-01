import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnadirrepuestoPage } from './anadirrepuesto.page';

const routes: Routes = [
  {
    path: '',
    component: AnadirrepuestoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnadirrepuestoPageRoutingModule {}
