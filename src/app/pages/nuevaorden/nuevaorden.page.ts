import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonModal } from '@ionic/angular';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { UsuarioI, ClienteST, InventarioRepuesto, Dispositivos, Taller, Ordenes } from 'src/app/models/modelos';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-nuevaorden',
  templateUrl: './nuevaorden.page.html',
  styleUrls: ['./nuevaorden.page.scss'],
  encapsulation: ViewEncapsulation.None
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
    nrorden: null
  }
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
    nrorden: null
  }
  busquedacliente: string;
  private clientes: ClienteST[] = []

  // ---VARIABLES DISPOSITIVOS---
  muestradispositivo: Dispositivos = {
    marcadisp: null,
    modelodisp: null,
  }
  datosdispositivo: Dispositivos = {
    marcadisp: null,
    modelodisp: null,
  }
  busquedadispositivo: string;
  problemadisp: string;
  private dispositivos: Dispositivos[] = []

  // ---VARIABLES TECNICOS---
  muestratecnico: UsuarioI = {
    nombre: null,
    rut: null,
    correo: null,
    nrotelefono: null,
    clave: null,
    cargo: null,
    nombretaller: null,
  }
  private tecnicos: UsuarioI[] = []

  // ---VARIABLES REPUESTOS---
  muestrainventario: InventarioRepuesto = {
    nombrers: null,
    marca: null,
    modelo: null,
    variante: null,
    cantidad: null,
    proveedor: null,
    valor: null,
  }
  busquedainventario: string;
  private repuestos: InventarioRepuesto[] = [];

  // ---VARIABLE MULTIPLE "INFORDEN"---
  inforden = {
    // ---VARIABLES TOGGLE'S "DATOS DE INGRESO"---
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

    // ---VARIABLE SUELTA "N° DE ORDEN ACTUAL"---
    nroorden: null,

    // ---VARIABLE "OBSERVACIONES"---
    observaciones: null,

    // ---VARIABLE "TIPO DE INGRESO"---
    tipodeingreso: null,

    // ---VARIABLES "FECHAS"---
    fechaestim: null,
    fechahoy: null,
    abono: null
  }

  // ---VARIABLE "INGRESO"---
  ingreso: null

  // ---VARIABLES "ORDEN DE TRABAJO"---
  orden: Ordenes = {
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
      valor: null
    }
  }

  ord: Ordenes[] = [];

  constructor(
    private firestore: FirestoredatabaseService
  ) { }

  ngOnInit() {
    this.traerclientes()
    this.traerrepuestos()
    this.traerdispositivos()
    this.traertecnicos()
  }

  // ---FUNCIONES PARA CLIENTES---
  async guardarcliente() {
    const path = 'Clientes';
    await this.firestore.createClient(this.datoscliente, path)
    this.datoscliente.nombrecliente = null;
    this.datoscliente.rutcliente = null;
    this.datoscliente.correocliente = null;
    this.datoscliente.nrotelefonocliente = null;
    this.datoscliente.comunacliente = null;
  }

  handleChange(event) {
    this.firestore.getCollectionQuery<ClienteST>('Clientes', 'rutcliente', '==', this.busquedacliente).subscribe(res => {
      console.log(res);
      this.clientes = res;
    });
  }

  traerclientes() {
    this.firestore.getCollection<ClienteST>('Clientes').subscribe(res => {
      console.log(res);
      this.clientes = res;
    })
  }

  // --- FUNCIONES PARA DISPOSITIVOS---
  async guardardispositivo() {
    const path = 'Dispositivos';
    await this.firestore.createClient(this.datosdispositivo, path)
    this.datosdispositivo.marcadisp = null;
    this.datosdispositivo.modelodisp = null;
  }

  handleChangeII(event) {
    this.firestore.getCollectionQuery<Dispositivos>('Dispositivos', 'modelodisp', '==', this.busquedadispositivo).subscribe(res => {
      console.log(res);
      this.dispositivos = res;
    });
  }
  traerdispositivos() {
    this.firestore.getCollection<Dispositivos>('Dispositivos').subscribe(res => {
      console.log(res);
      this.dispositivos = res;
    })
  }

  // ---FUNCIONES PARA TECNICOS---
  traertecnicos() {
    this.firestore.getCollectionQuery<UsuarioI>('Usuarios', 'cargo', '==', 'Tecnico').subscribe(res => {
      console.log(res);
      this.tecnicos = res;
    })
  }

  // ---FUNCIONES PARA REPUESTOS---
  handleChangeIII(event) {
    this.firestore.getCollectionQuery<InventarioRepuesto>('RepuestoServicio', 'modelo', '==', this.busquedainventario).subscribe(res => {
      console.log(res);
      this.repuestos = res;
    });
  }
  traerrepuestos() {
    this.firestore.getCollection<InventarioRepuesto>('RepuestoServicio').subscribe(res => {
      console.log(res);
      this.repuestos = res;
    })
  }

  // ---FUNCION TIPO DE INGRESO---  
  tipoingreso() {
    this.inforden.tipodeingreso = this.ingreso
  }

  // ---FUNCION GENERAR ORDEN---

  async generarorden() {
    this.orden.cliente = this.muestracliente;
    this.orden.inforden = this.inforden;
    this.orden.repuesto = this.muestrainventario;
    
    const path = 'Ordenes';
    await this.firestore.createClient(this.orden, path)
  }
}