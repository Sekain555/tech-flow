//Aqui instalamos los modulos que vamos a utilizar en nuestra página web

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SwiperModule } from 'swiper/angular';
import { ReactiveFormsModule } from '@angular/forms';

/*Importa la función HTTPclient, se aplica en la app.module.ts y en las similares de las páginas a utilizar
(pero sin el Module)*/
import { HttpClientModule } from '@angular/common/http';

//Importa la función de Escaneo de QR usando el Capacitor Community Barcode Scanner
import { BarcodeScanner } from'@capacitor-community/barcode-scanner';

//Importa las funciones de Firebase usando AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirestoreModule } from '@angular/fire/firestore';

//Importa la función de gráficos estadísticos
import { NgChartsModule } from 'ng2-charts';
import { initializeApp } from 'firebase/app';

@NgModule({
  declarations: [AppComponent],
  imports:
    [BrowserModule,
      IonicModule.forRoot(), 
      AppRoutingModule, 
      HttpClientModule, 
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      NgChartsModule,
      FirestoreModule,
      ReactiveFormsModule
    ],
  providers: [ { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }