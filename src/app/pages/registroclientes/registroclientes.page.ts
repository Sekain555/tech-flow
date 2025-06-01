import { Component, OnInit } from '@angular/core';
import { ClienteST } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';

@Component({
  selector: 'app-registroclientes',
  templateUrl: './registroclientes.page.html',
  styleUrls: ['./registroclientes.page.scss'],
})
export class RegistroclientesPage implements OnInit {

  busquedacliente: string = null;
  clientes: ClienteST[] = [];

  constructor(
    private firestore: FirestoredatabaseService
  ) { }

  ngOnInit() {
    this.traercliente()
  }

  traercliente() {
    this.firestore.getCollection<ClienteST>('Clientes').subscribe(res => {
      console.log(res);
      this.clientes = res;
    })
  }

  buscarcliente() {
    this.firestore.getCollectionQuery<ClienteST>('Clientes', 'rutcliente', '==', this.busquedacliente).subscribe(res => {
      console.log(res);
      this.clientes = res;
    });
  }
}