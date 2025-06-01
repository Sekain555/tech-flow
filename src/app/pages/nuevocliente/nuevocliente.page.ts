import { Component, OnInit } from '@angular/core';
import { ClienteST } from 'src/app/models/modelos';
import { NavController } from '@ionic/angular';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nuevocliente',
  templateUrl: './nuevocliente.page.html',
  styleUrls: ['./nuevocliente.page.scss'],
})
export class NuevoclientePage implements OnInit {

  datoscliente: ClienteST = {
    nombrecliente: null,
    rutcliente: null,
    correocliente: null,
    nrotelefonocliente: null,
    comunacliente: null,
    dispositivos: {
        marcadisp: null,
        modelodisp: null,
        imei: null,
        problemadisp: null,
    },
    nrorden: null
  }

  constructor(
    private navCtrl: NavController,
    private firestore: FirestoredatabaseService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  async guardarcliente() {
    const path = 'Clientes';
    await this.firestore.createClient(this.datoscliente, path);
    this.router.navigate(['/menuclientes']);
  }
}