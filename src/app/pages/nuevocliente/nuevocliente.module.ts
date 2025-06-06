import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoclientePageRoutingModule } from './nuevocliente-routing.module';

import { NuevoclientePage } from './nuevocliente.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoclientePageRoutingModule,
    SwiperModule,
  ],
  declarations: [NuevoclientePage]
})
export class NuevoclientePageModule {}
