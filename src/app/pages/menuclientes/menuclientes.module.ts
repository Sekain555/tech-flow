import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuclientesPageRoutingModule } from './menuclientes-routing.module';

import { MenuclientesPage } from './menuclientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuclientesPageRoutingModule
  ],
  declarations: [MenuclientesPage]
})
export class MenuclientesPageModule {}
