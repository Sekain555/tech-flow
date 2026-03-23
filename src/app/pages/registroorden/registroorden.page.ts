import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Ordenes } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-registroorden',
  templateUrl: './registroorden.page.html',
  styleUrls: ['./registroorden.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroordenPage implements OnInit {

  ordenes: Ordenes[] = [];
  ordenSeleccionada: Ordenes = null;

  estados: string[] = [
    'ingresado',
    'en reparacion',
    'esperando repuesto',
    'reparado',
    'sin reparacion'
  ];

  constructor(
    private navCtrl: NavController,
    private firestore: FirestoredatabaseService,
    private session: SessionService
  ) { }

  ngOnInit() {
    this.traerordenes();
  }

  traerordenes() {
    this.firestore.getCollectionByTenant<Ordenes>('workorders', this.session.tenantId)
      .subscribe(res => {
        this.ordenes = res;
      });
  }

  seleccionarOrden(orden: Ordenes) {
    this.ordenSeleccionada = { ...orden };
  }

  async cambiarEstado(orden: Ordenes, nuevoEstado: string) {
    if (!orden.id) return;
    await this.firestore.updateDocByTenant(
      'workorders',
      this.session.tenantId,
      orden.id,
      { estado: nuevoEstado }
    );
  }

  async cerrarOrden(orden: Ordenes) {
    await this.cambiarEstado(orden, 'reparado');
  }

  @ViewChild(IonModal) modal: IonModal;
}