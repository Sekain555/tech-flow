import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuvideosPage } from './menuvideos.page';

const routes: Routes = [
  {
    path: '',
    component: MenuvideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuvideosPageRoutingModule {}
