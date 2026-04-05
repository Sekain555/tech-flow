import { Component, OnInit } from '@angular/core';
import { InventarioRepuesto } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-anadirrepuesto',
  templateUrl: './anadirrepuesto.page.html',
  styleUrls: ['./anadirrepuesto.page.scss'],
})
export class AnadirrepuestoPage implements OnInit {

  datosrepuesto: InventarioRepuesto = {
    nombrers: null,
    marca: null,
    modelo: null,
    variante: null,
    cantidad: null,
    proveedor: null,
    valor: null,
  };

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService
  ) { }

  ngOnInit() { }

  async guardarrepuesto() {
    await this.firestore.createDocByTenant('inventory', this.session.tenantId, this.datosrepuesto);
  }
}