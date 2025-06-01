import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuinventarioPageRoutingModule } from './menuinventario-routing.module';

import { MenuinventarioPage } from './menuinventario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuinventarioPageRoutingModule
  ],
  declarations: [MenuinventarioPage]
})
export class MenuinventarioPageModule {}
