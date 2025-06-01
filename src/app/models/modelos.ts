export interface UsuarioI {
    nombre: string;
    rut: string;
    correo: string;
    nrotelefono: number;
    clave: string;
    cargo: 'administrador' | 'tecnico' | 'vendedor';
    nombretaller: string;
}

export interface Taller {
    nombretaller: string;
    rutempresa: string;
    correotaller: string;
    nrotelefonotaller: number;
    direcciontaller: string;
    comuna: string;
    region: string;
}

export interface ClienteST {
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
    }
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
    }
}