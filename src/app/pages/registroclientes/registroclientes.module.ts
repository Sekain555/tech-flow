import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroclientesPageRoutingModule } from './registroclientes-routing.module';

import { RegistroclientesPage } from './registroclientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroclientesPageRoutingModule
  ],
  declarations: [RegistroclientesPage]
})
export class RegistroclientesPageModule {}
