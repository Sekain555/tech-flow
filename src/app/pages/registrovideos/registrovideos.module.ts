import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrovideosPageRoutingModule } from './registrovideos-routing.module';

import { RegistrovideosPage } from './registrovideos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrovideosPageRoutingModule
  ],
  declarations: [RegistrovideosPage]
})
export class RegistrovideosPageModule {}
