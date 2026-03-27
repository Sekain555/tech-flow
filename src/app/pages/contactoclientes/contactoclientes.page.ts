import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { ClienteST } from 'src/app/models/modelos';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-contactoclientes',
  templateUrl: './contactoclientes.page.html',
  styleUrls: ['./contactoclientes.page.scss'],
})
export class ContactoclientesPage implements OnInit {

  muestracliente: ClienteST = {
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
  };

  busquedacliente: string;
  clientes: ClienteST[] = [];

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService
  ) { }

  ngOnInit() {
    this.traerclientes();
  }

  handleChange(event) {
    this.firestore.getCollectionByTenantQuery<ClienteST>(
      'clients',
      this.session.tenantId,
      'rutcliente',
      '==',
      this.busquedacliente
    ).subscribe(res => {
      this.clientes = res;
    });
  }

  traerclientes() {
    this.firestore.getCollectionByTenant<ClienteST>('clients', this.session.tenantId)
      .subscribe(res => {
        this.clientes = res;
      });
  }
}