export interface UsuarioI {
  nombre: string;
  rut: string;
  correo: string;
  nrotelefono: number;
  clave: string;
  cargo: 'administrador' | 'tecnico' | 'vendedor';
  nombretaller: string;
  tenantId?: string;
}

// ← LEGACY: usar Tenant (pendiente crear) para nuevos desarrollos
// Campos ownerUid, estado, creadoEn y onboardingCompletado agregados
// para compatibilidad con arquitectura multi-tenant
export interface Taller {
  nombretaller: string;
  rutempresa: string;
  correotaller: string;
  nrotelefonotaller: number;
  direcciontaller: string;
  comuna: string;
  region: string;
  ownerUid?: string;
  estado?: 'trial' | 'activo' | 'suspendido';
  creadoEn?: string;
  onboardingCompletado?: boolean;
}

export interface ClienteST {
  id?: string;
  nrorden: number;
  nombrecliente: string;
  rutcliente: string;
  correocliente: string;
  nrotelefonocliente: number;
  comunacliente: string;
  dispositivos: {
    marcadisp: string;
    modelodisp: string;
    imei: string;
    problemadisp: string;
  };
}

export interface InventarioRepuesto {
  id?: string;
  nombrers: string;
  marca: string;
  modelo: string;
  variante: string;
  cantidad: number;
  proveedor: string;
  valor: number;
}

export interface Dispositivos {
  marcadisp: string;
  modelodisp: string;
}

export interface Ordenes {
  id?: string;
  estado:
    | 'ingresado'
    | 'en reparacion'
    | 'esperando repuesto'
    | 'reparado'
    | 'sin reparacion';
  cliente: {
    nrorden: number;
    nombrecliente: string;
    rutcliente: string;
    correocliente: string;
    nrotelefonocliente: number;
    dispositivos: {
      marcadisp: string;
      modelodisp: string;
      imei: string;
      problemadisp: string;
    };
  };
  inforden: {
    ingresatarjeta: boolean;
    ingresasim: boolean;
    ingresabateria: boolean;
    ingresatapa: boolean;
    ingresacableusb: boolean;
    ingresacargador: boolean;
    ingresaspen: boolean;
    funcionencendido: boolean;
    funcioncarga: boolean;
    funcionimagen: boolean;
    funciontactil: boolean;
    funcionmicrofono: boolean;
    funcionauricular: boolean;
    funcionparlante: boolean;
    funcioncamara: boolean;
    nroorden: number;
    observaciones: string;
    tipodeingreso: string;
    fechaestim: string;
    fechahoy: string;
    abono: number;
  };
  nombreregistro: string;
  cargo: string;
  taller: {
    nombretaller: string;
    rutempresa: string;
    correotaller: string;
    nrotelefonotaller: number;
    direcciontaller: string;
    comuna: string;
    region: string;
  };
  repuesto: {
    nombrers: string;
    marca: string;
    modelo: string;
    variante: string;
    cantidad: number;
    valor: number;
  };
}
