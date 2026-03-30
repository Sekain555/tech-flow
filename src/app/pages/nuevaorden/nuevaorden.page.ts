import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import {
  UsuarioI,
  ClienteST,
  InventarioRepuesto,
  Dispositivos,
  Ordenes,
} from 'src/app/models/modelos';
import { NgForm } from '@angular/forms';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-nuevaorden',
  templateUrl: './nuevaorden.page.html',
  styleUrls: ['./nuevaorden.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevaordenPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  // ---VARIABLES CLIENTES---
  muestracliente: ClienteST = {
    nombrecliente: null,
    rutcliente: null,
    correocliente: null,
    nrotelefonocliente: null,
    comunacliente: null,
    dispositivos: {
      marcadisp: null,
      modelodisp: null,
      imei: null,
      problemadisp: null,
    },
    nrorden: null,
  };
  datoscliente: ClienteST = {
    nombrecliente: null,
    rutcliente: null,
    correocliente: null,
    nrotelefonocliente: null,
    comunacliente: null,
    dispositivos: {
      marcadisp: null,
      modelodisp: null,
      imei: null,
      problemadisp: null,
    },
    nrorden: null,
  };
  busquedacliente: string;
  clientes: ClienteST[] = [];

  // ---VARIABLES DISPOSITIVOS---
  muestradispositivo: Dispositivos = { marcadisp: null, modelodisp: null };
  datosdispositivo: Dispositivos = { marcadisp: null, modelodisp: null };
  busquedadispositivo: string;
  problemadisp: string;
  dispositivos: Dispositivos[] = [];

  // ---VARIABLES TECNICOS---
  muestratecnico: UsuarioI = {
    nombre: null,
    rut: null,
    correo: null,
    nrotelefono: null,
    clave: null,
    cargo: null,
    nombretaller: null,
    tenantId: null,
  };
  tecnicos: UsuarioI[] = [];

  // ---VARIABLES REPUESTOS---
  muestrainventario: InventarioRepuesto = {
    nombrers: null,
    marca: null,
    modelo: null,
    variante: null,
    cantidad: null,
    proveedor: null,
    valor: null,
  };
  busquedainventario: string;
  repuestos: InventarioRepuesto[] = [];

  // ---VARIABLE MULTIPLE "INFORDEN"---
  inforden = {
    ingresasim: null,
    ingresatarjeta: null,
    ingresabateria: null,
    ingresatapa: null,
    ingresacableusb: null,
    ingresacargador: null,
    ingresaspen: null,
    funcionencendido: null,
    funcioncarga: null,
    funcionimagen: null,
    funciontactil: null,
    funcionmicrofono: null,
    funcionauricular: null,
    funcionparlante: null,
    funcioncamara: null,
    nroorden: null,
    observaciones: null,
    tipodeingreso: null,
    fechaestim: null,
    fechahoy: null,
    abono: null,
  };

  ingreso: null;

  // ---VARIABLES ORDEN---
  orden: Ordenes = {
    estado: 'ingresado',
    cliente: {
      nrorden: null,
      nombrecliente: null,
      rutcliente: null,
      correocliente: null,
      nrotelefonocliente: null,
      dispositivos: {
        marcadisp: null,
        modelodisp: null,
        imei: null,
        problemadisp: null,
      },
    },
    inforden: {
      ingresatarjeta: null,
      ingresasim: null,
      ingresabateria: null,
      ingresatapa: null,
      ingresacableusb: null,
      ingresacargador: null,
      ingresaspen: null,
      funcionencendido: null,
      funcioncarga: null,
      funcionimagen: null,
      funciontactil: null,
      funcionmicrofono: null,
      funcionauricular: null,
      funcionparlante: null,
      funcioncamara: null,
      nroorden: null,
      observaciones: null,
      tipodeingreso: null,
      fechaestim: null,
      fechahoy: null,
      abono: null,
    },
    nombreregistro: null,
    cargo: null,
    taller: {
      nombretaller: null,
      rutempresa: null,
      correotaller: null,
      nrotelefonotaller: null,
      direcciontaller: null,
      comuna: null,
      region: null,
    },
    repuesto: {
      nombrers: null,
      marca: null,
      modelo: null,
      variante: null,
      cantidad: null,
      valor: null,
    },
  };

  ord: Ordenes[] = [];

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.traerclientes();
    this.traerrepuestos();
    this.traerdispositivos();
    this.traertecnicos();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'bottom',
      duration: 1500,
    });
    await toast.present();
  }

  // ---CLIENTES---
  async guardarcliente(formularioCliente: NgForm) {
    if (formularioCliente.invalid) {
      Object.values(formularioCliente.controls).forEach((c) =>
        c.markAsTouched(),
      );
      this.presentToast('Datos incompletos o con errores de formato');
      return;
    }
    await this.firestore.createDocByTenant(
      'clients',
      this.session.tenantId,
      this.datoscliente,
    );
    this.datoscliente = {
      nombrecliente: null,
      rutcliente: null,
      correocliente: null,
      nrotelefonocliente: null,
      comunacliente: null,
      dispositivos: {
        marcadisp: null,
        modelodisp: null,
        imei: null,
        problemadisp: null,
      },
      nrorden: null,
    };
    this.cerrarModal();
  }

  handleChange(event) {
    this.firestore
      .getCollectionByTenantQuery<ClienteST>(
        'clients',
        this.session.tenantId,
        'rutcliente',
        '==',
        this.busquedacliente,
      )
      .subscribe((res) => (this.clientes = res));
  }

  traerclientes() {
    this.firestore
      .getCollectionByTenant<ClienteST>('clients', this.session.tenantId)
      .subscribe((res) => (this.clientes = res));
  }

  // ---DISPOSITIVOS--- (catálogo global)
  async guardardispositivo(formularioDispositivo: NgForm) {
    if (formularioDispositivo.invalid) {
      Object.values(formularioDispositivo.controls).forEach((c) =>
        c.markAsTouched(),
      );
      this.presentToast('Datos incompletos o con errores de formato');
      return;
    }
    await this.firestore.addToCatalog('devices', this.datosdispositivo);
    this.datosdispositivo = { marcadisp: null, modelodisp: null };
    this.cerrarModal();
  }

  handleChangeII(event) {
    this.firestore
      .getCatalogQuery<Dispositivos>(
        'devices',
        'modelodisp',
        '==',
        this.busquedadispositivo,
      )
      .subscribe((res) => (this.dispositivos = res));
  }

  traerdispositivos() {
    this.firestore
      .getCatalog<Dispositivos>('devices')
      .subscribe((res) => (this.dispositivos = res));
  }

  // ---TECNICOS---
  traertecnicos() {
    this.firestore
      .getCollectionByTenantQuery<UsuarioI>(
        'users',
        this.session.tenantId,
        'cargo',
        '==',
        'tecnico',
      )
      .subscribe((res) => (this.tecnicos = res));
  }

  // ---REPUESTOS---
  handleChangeIII(event) {
    this.firestore
      .getCollectionByTenantQuery<InventarioRepuesto>(
        'inventory',
        this.session.tenantId,
        'modelo',
        '==',
        this.busquedainventario,
      )
      .subscribe((res) => (this.repuestos = res));
  }

  traerrepuestos() {
    this.firestore
      .getCollectionByTenant<InventarioRepuesto>(
        'inventory',
        this.session.tenantId,
      )
      .subscribe((res) => (this.repuestos = res));
  }

  tipoingreso() {
    this.inforden.tipodeingreso = this.ingreso;
  }

  // ---GENERAR ORDEN---
  async generarorden() {
    this.orden.cliente = this.muestracliente;
    this.orden.cliente.dispositivos.marcadisp =
      this.muestradispositivo.marcadisp;
    this.orden.cliente.dispositivos.modelodisp =
      this.muestradispositivo.modelodisp;
    this.orden.inforden = this.inforden;
    this.orden.repuesto = this.muestrainventario;
    this.orden.inforden.fechahoy = new Date().toISOString();
    this.orden.estado = 'ingresado';

    await this.firestore.createDocByTenant(
      'workorders',
      this.session.tenantId,
      this.orden,
    );
    this.presentToast('Orden generada correctamente');
  }
}
