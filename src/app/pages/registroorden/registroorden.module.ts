import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroordenPageRoutingModule } from './registroorden-routing.module';

import { RegistroordenPage } from './registroorden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroordenPageRoutingModule
  ],
  declarations: [RegistroordenPage]
})
export class RegistroordenPageModule {}
