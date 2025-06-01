import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrovideosPage } from './registrovideos.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrovideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrovideosPageRoutingModule {}
