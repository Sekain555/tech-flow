import { Component, OnInit } from '@angular/core';
import { ClienteST, Ordenes } from 'src/app/models/modelos';
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
  clienteSeleccionado: ClienteST = null;
  ordenesCliente: Ordenes[] = [];

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

  verHistorial(cliente: ClienteST) {
    this.clienteSeleccionado = cliente;
    this.firestore.getCollectionByTenantQuery<Ordenes>(
      'workorders',
      this.session.tenantId,
      'cliente.rutcliente',
      '==',
      cliente.rutcliente
    ).subscribe(res => {
      this.ordenesCliente = res;
    });
  }

  colorEstado(estado: string): string {
    switch (estado) {
      case 'ingresado': return 'primary';
      case 'en reparacion': return 'warning';
      case 'esperando repuesto': return 'tertiary';
      case 'reparado': return 'success';
      case 'sin reparacion': return 'danger';
      default: return 'medium';
    }
  }
}