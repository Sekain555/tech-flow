import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaordenPage } from './nuevaorden.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaordenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaordenPageRoutingModule {}
