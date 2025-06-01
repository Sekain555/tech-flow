import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaordenPageRoutingModule } from './nuevaorden-routing.module';

import { NuevaordenPage } from './nuevaorden.page';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaordenPageRoutingModule,
    SwiperModule
  ],
  declarations: [NuevaordenPage]
})
export class NuevaordenPageModule {}
