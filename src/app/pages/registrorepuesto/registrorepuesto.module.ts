import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrorepuestoPageRoutingModule } from './registrorepuesto-routing.module';

import { RegistrorepuestoPage } from './registrorepuesto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrorepuestoPageRoutingModule
  ],
  declarations: [RegistrorepuestoPage]
})
export class RegistrorepuestoPageModule {}
