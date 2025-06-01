import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StrapisqlService {

  APIREPUESTO = 'http://localhost:1337/api/repuestos'

  constructor(
    private http: HttpClient
  ) { }

  leerOrdenes(){
  }

  leerNroOrden(){
    
  }

  crearOrden(){
    
  }

  getOrdenes(){
    
  }

  eliminarOrden(){
    
  }
  leerRepuestos(){
    return this.http.get(this.APIREPUESTO)
  }

}