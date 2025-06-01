import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CcuentaPageRoutingModule } from './ccuenta-routing.module';

import { CcuentaPage } from './ccuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CcuentaPageRoutingModule
  ],
  declarations: [CcuentaPage]
})
export class CcuentaPageModule {}
