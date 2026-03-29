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
  encapsulation: ViewEncapsulation.None,
})
export class RegistroordenPage implements OnInit {
  ordenes: Ordenes[] = [];
  ordenesFiltradas: Ordenes[] = [];
  ordenSeleccionada: Ordenes = null;

  filtroNombre: string = '';
  filtroEstado: string = '';

  estados: string[] = [
    'ingresado',
    'en reparacion',
    'esperando repuesto',
    'reparado',
    'sin reparacion',
  ];

  constructor(
    private navCtrl: NavController,
    private firestore: FirestoredatabaseService,
    private session: SessionService,
  ) {}

  ngOnInit() {
    this.traerordenes();
  }

  traerordenes() {
    this.firestore
      .getCollectionByTenant<Ordenes>('workorders', this.session.tenantId)
      .subscribe((res) => {
        this.ordenes = res;
        this.ordenesFiltradas = res;
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
      { estado: nuevoEstado },
    );
  }

  async cerrarOrden(orden: Ordenes) {
    await this.cambiarEstado(orden, 'sin reparacion');
  }

  filtrarOrdenes() {
    this.ordenesFiltradas = this.ordenes.filter((orden) => {
      const coincideNombre = this.filtroNombre
        ? orden.cliente.nombrecliente
            ?.toLowerCase()
            .includes(this.filtroNombre.toLowerCase())
        : true;
      const coincideEstado = this.filtroEstado
        ? orden.estado === this.filtroEstado
        : true;
      return coincideNombre && coincideEstado;
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroEstado = '';
    this.ordenesFiltradas = [...this.ordenes];
  }

  colorEstado(estado: string): string {
    switch (estado) {
      case 'ingresado':
        return 'primary';
      case 'en reparacion':
        return 'warning';
      case 'esperando repuesto':
        return 'tertiary';
      case 'reparado':
        return 'success';
      case 'sin reparacion':
        return 'danger';
      default:
        return 'medium';
    }
  }

  @ViewChild(IonModal) modal: IonModal;
}
