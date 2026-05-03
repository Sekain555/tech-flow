import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { InventarioRepuesto } from 'src/app/models/modelos';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registrorepuesto',
  templateUrl: './registrorepuesto.page.html',
  styleUrls: ['./registrorepuesto.page.scss'],
})
export class RegistrorepuestoPage implements OnInit {
  repuestos: InventarioRepuesto[] = [];
  busqueda: string = null;
  repuestoEditando: InventarioRepuesto = null;

  readonly STOCK_CRITICO = 3;

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService,
    private toastController: ToastController,
    private alertController: AlertController,
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

  seleccionarEditar(repuesto: InventarioRepuesto) {
    this.repuestoEditando = { ...repuesto };
  }

  async guardarEdicionRepuesto(modal: any) {
    if (!this.repuestoEditando.id) return;
    await this.firestore.updateDocByTenant(
      'inventory',
      this.session.tenantId,
      this.repuestoEditando.id,
      {
        nombrers: this.repuestoEditando.nombrers,
        marca: this.repuestoEditando.marca,
        modelo: this.repuestoEditando.modelo,
        variante: this.repuestoEditando.variante,
        cantidad: this.repuestoEditando.cantidad,
        proveedor: this.repuestoEditando.proveedor,
        valor: this.repuestoEditando.valor,
      },
    );
    modal.dismiss();
    this.presentToast('Repuesto actualizado correctamente');
  }

  async confirmarEliminar(repuesto: InventarioRepuesto) {
    const alert = await this.alertController.create({
      header: 'Eliminar repuesto',
      message: `¿Estás seguro de eliminar "${repuesto.nombrers}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarRepuesto(repuesto),
        },
      ],
    });
    await alert.present();
  }

  async eliminarRepuesto(repuesto: InventarioRepuesto) {
    if (!repuesto.id) return;
    await this.firestore.deleteDocByTenant(
      'inventory',
      this.session.tenantId,
      repuesto.id,
    );
    this.presentToast('Repuesto eliminado correctamente');
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'bottom',
      duration: 1500,
    });
    await toast.present();
  }
}
