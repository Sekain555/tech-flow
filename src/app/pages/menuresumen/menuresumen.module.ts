import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuresumenPageRoutingModule } from './menuresumen-routing.module';

import { MenuresumenPage } from './menuresumen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuresumenPageRoutingModule
  ],
  declarations: [MenuresumenPage]
})
export class MenuresumenPageModule {}
