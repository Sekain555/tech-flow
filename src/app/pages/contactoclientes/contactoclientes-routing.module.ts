import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactoclientesPage } from './contactoclientes.page';

const routes: Routes = [
  {
    path: '',
    component: ContactoclientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactoclientesPageRoutingModule {}
