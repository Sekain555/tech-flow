import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuresumenvenPageRoutingModule } from './menuresumenven-routing.module';

import { MenuresumenvenPage } from './menuresumenven.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuresumenvenPageRoutingModule
  ],
  declarations: [MenuresumenvenPage]
})
export class MenuresumenvenPageModule {}
