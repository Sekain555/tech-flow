import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuvideosPageRoutingModule } from './menuvideos-routing.module';

import { MenuvideosPage } from './menuvideos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuvideosPageRoutingModule
  ],
  declarations: [MenuvideosPage]
})
export class MenuvideosPageModule {}
