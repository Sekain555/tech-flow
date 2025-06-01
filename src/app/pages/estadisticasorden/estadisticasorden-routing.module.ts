import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasordenPage } from './estadisticasorden.page';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasordenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasordenPageRoutingModule {}
