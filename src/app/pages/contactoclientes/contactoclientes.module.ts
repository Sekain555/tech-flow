import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactoclientesPageRoutingModule } from './contactoclientes-routing.module';

import { ContactoclientesPage } from './contactoclientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactoclientesPageRoutingModule
  ],
  declarations: [ContactoclientesPage]
})
export class ContactoclientesPageModule {}
