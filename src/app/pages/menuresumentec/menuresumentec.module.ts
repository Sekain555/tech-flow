import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuresumentecPageRoutingModule } from './menuresumentec-routing.module';

import { MenuresumentecPage } from './menuresumentec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuresumentecPageRoutingModule
  ],
  declarations: [MenuresumentecPage]
})
export class MenuresumentecPageModule {}
