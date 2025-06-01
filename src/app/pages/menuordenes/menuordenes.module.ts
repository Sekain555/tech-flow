import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuordenesPageRoutingModule } from './menuordenes-routing.module';

import { MenuordenesPage } from './menuordenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuordenesPageRoutingModule
  ],
  declarations: [MenuordenesPage]
})
export class MenuordenesPageModule {}
