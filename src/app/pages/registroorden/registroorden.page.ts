import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Ordenes } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { IonModal } from '@ionic/angular';
import jsPDF from 'jspdf';

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
  filtroNroOrden: string = '';

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
      const coincideNroOrden = this.filtroNroOrden
        ? orden.inforden.nroorden?.toString().includes(this.filtroNroOrden)
        : true;
      return coincideNombre && coincideEstado && coincideNroOrden;
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroEstado = '';
    this.filtroNroOrden = '';
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

  exportarPDF(orden: Ordenes) {
    const doc = new jsPDF();
    const margen = 15;
    let y = margen;

    // ─── ENCABEZADO ───────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDEN DE TRABAJO', 105, y, { align: 'center' });
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° ${orden.inforden.nroorden ?? 'S/N'}`, 105, y, {
      align: 'center',
    });
    y += 10;

    doc.setLineWidth(0.5);
    doc.line(margen, y, 195, y);
    y += 8;

    // ─── DATOS DEL CLIENTE ────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', margen, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${orden.cliente.nombrecliente ?? '-'}`, margen, y);
    y += 5;
    doc.text(`RUT: ${orden.cliente.rutcliente ?? '-'}`, margen, y);
    y += 5;
    doc.text(`Correo: ${orden.cliente.correocliente ?? '-'}`, margen, y);
    y += 5;
    doc.text(`Teléfono: ${orden.cliente.nrotelefonocliente ?? '-'}`, margen, y);
    y += 10;

    // ─── DATOS DEL DISPOSITIVO ────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL DISPOSITIVO', margen, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Marca: ${orden.cliente.dispositivos.marcadisp ?? '-'}`,
      margen,
      y,
    );
    y += 5;
    doc.text(
      `Modelo: ${orden.cliente.dispositivos.modelodisp ?? '-'}`,
      margen,
      y,
    );
    y += 5;
    doc.text(`IMEI: ${orden.cliente.dispositivos.imei ?? '-'}`, margen, y);
    y += 5;
    doc.text(
      `Problema: ${orden.cliente.dispositivos.problemadisp ?? '-'}`,
      margen,
      y,
    );
    y += 10;

    // ─── DATOS DE LA ORDEN ────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DE LA ORDEN', margen, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estado: ${orden.estado ?? '-'}`, margen, y);
    y += 5;
    doc.text(
      `Tipo de ingreso: ${orden.inforden.tipodeingreso ?? '-'}`,
      margen,
      y,
    );
    y += 5;

    const fechaIngreso = orden.inforden.fechahoy
      ? new Date(orden.inforden.fechahoy).toLocaleDateString('es-CL')
      : '-';
    doc.text(`Fecha de ingreso: ${fechaIngreso}`, margen, y);
    y += 5;
    doc.text(
      `Observaciones: ${orden.inforden.observaciones ?? '-'}`,
      margen,
      y,
    );
    y += 5;
    doc.text(`Abono: $${orden.inforden.abono ?? 0}`, margen, y);
    y += 10;

    // ─── REPUESTO ─────────────────────────────────────────────────
    if (orden.repuesto?.nombrers) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('REPUESTO / SERVICIO', margen, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${orden.repuesto.nombrers}`, margen, y);
      y += 5;
      doc.text(
        `Marca/Modelo: ${orden.repuesto.marca ?? '-'} ${orden.repuesto.modelo ?? '-'}`,
        margen,
        y,
      );
      y += 5;
      doc.text(`Valor: $${orden.repuesto.valor ?? 0}`, margen, y);
      y += 10;
    }

    // ─── PIE DE PÁGINA ────────────────────────────────────────────
    doc.setLineWidth(0.5);
    doc.line(margen, y, 195, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Documento generado por TechFlow', 105, y, { align: 'center' });

    // ─── DESCARGAR ────────────────────────────────────────────────
    doc.save(
      `orden-${orden.inforden.nroorden ?? 'ST'}-${orden.cliente.nombrecliente ?? 'cliente'}.pdf`,
    );
  }
}
