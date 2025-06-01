import { Component, OnInit } from '@angular/core';
import { InventarioRepuesto } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';

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
  }

  constructor(
    private firestore: FirestoredatabaseService
  ) { }

  ngOnInit() {
  }

  async guardarrepuesto() {
    const path = 'RepuestoServicio';
    await this.firestore.createClient(this.datosrepuesto, path);
  }

}
