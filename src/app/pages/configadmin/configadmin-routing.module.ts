import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigadminPage } from './configadmin.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigadminPageRoutingModule {}
