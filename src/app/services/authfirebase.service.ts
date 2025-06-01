import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioI } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class AuthfirebaseService {

  constructor(private authfirebase: AngularFireAuth) { }

  login(correo: string, password: string) {
    return this.authfirebase.signInWithEmailAndPassword(correo, password)
  }

  logout() {
    this.authfirebase.signOut();
  }

  registrousuario(datosusuario: UsuarioI) {
    return this.authfirebase.createUserWithEmailAndPassword(datosusuario.correo, datosusuario.clave);
  }

  estadousuario(){
    return this.authfirebase.authState
  }
}
