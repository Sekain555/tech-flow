import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { InventarioRepuesto } from 'src/app/models/modelos';

@Component({
  selector: 'app-registrorepuesto',
  templateUrl: './registrorepuesto.page.html',
  styleUrls: ['./registrorepuesto.page.scss'],
})
export class RegistrorepuestoPage implements OnInit {
  repuestos: InventarioRepuesto[] = [];
  busqueda: string = null;

  readonly STOCK_CRITICO = 3;

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService,
  ) {}

  ngOnInit() {
    this.traerrepuestos();
  }

  traerrepuestos() {
    this.firestore
      .getCollectionByTenant<InventarioRepuesto>(
        'inventory',
        this.session.tenantId,
      )
      .subscribe((res) => {
        this.repuestos = res;
      });
  }

  buscarrepuesto() {
    if (!this.busqueda) {
      this.traerrepuestos();
      return;
    }
    this.firestore
      .getCollectionByTenantQuery<InventarioRepuesto>(
        'inventory',
        this.session.tenantId,
        'nombrers',
        '==',
        this.busqueda,
      )
      .subscribe((res) => {
        this.repuestos = res;
      });
  }

  stockCritico(cantidad: number): boolean {
    return cantidad <= this.STOCK_CRITICO;
  }

  repuestosConStockCritico(): number {
    return this.repuestos.filter((r) => r.cantidad <= this.STOCK_CRITICO)
      .length;
  }
}
