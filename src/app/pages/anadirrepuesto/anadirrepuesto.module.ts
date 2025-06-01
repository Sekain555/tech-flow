import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnadirrepuestoPageRoutingModule } from './anadirrepuesto-routing.module';

import { AnadirrepuestoPage } from './anadirrepuesto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnadirrepuestoPageRoutingModule
  ],
  declarations: [AnadirrepuestoPage]
})
export class AnadirrepuestoPageModule {}
