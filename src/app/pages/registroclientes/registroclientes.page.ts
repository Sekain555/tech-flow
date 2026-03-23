import { Component, OnInit } from '@angular/core';
import { ClienteST } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-registroclientes',
  templateUrl: './registroclientes.page.html',
  styleUrls: ['./registroclientes.page.scss'],
})
export class RegistroclientesPage implements OnInit {

  busquedacliente: string = null;
  clientes: ClienteST[] = [];

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService
  ) { }

  ngOnInit() {
    this.traercliente();
  }

  traercliente() {
    this.firestore.getCollectionByTenant<ClienteST>('clients', this.session.tenantId)
      .subscribe(res => {
        this.clientes = res;
      });
  }

  buscarcliente() {
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
}