import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigadminPageRoutingModule } from './configadmin-routing.module';

import { ConfigadminPage } from './configadmin.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigadminPageRoutingModule,
    SwiperModule
  ],
  declarations: [ConfigadminPage]
})
export class ConfigadminPageModule {}
