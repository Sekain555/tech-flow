import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CcuentaPage } from './ccuenta.page';

const routes: Routes = [
  {
    path: '',
    component: CcuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CcuentaPageRoutingModule {}
