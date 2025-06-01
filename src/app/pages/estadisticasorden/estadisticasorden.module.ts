import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadisticasordenPageRoutingModule } from './estadisticasorden-routing.module';

import { EstadisticasordenPage } from './estadisticasorden.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadisticasordenPageRoutingModule,
    SwiperModule
  ],
  declarations: [EstadisticasordenPage]
})
export class EstadisticasordenPageModule {}
