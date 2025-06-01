import { Component, OnInit } from '@angular/core';
import { RadioGroupChangeEventDetail } from '@ionic/angular';
import { UsuarioI, Taller } from 'src/app/models/modelos';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ccuenta',
  templateUrl: './ccuenta.page.html',
  styleUrls: ['./ccuenta.page.scss'],
})
export class CcuentaPage implements OnInit {


  private validarAdmin: string = null;
  private administrador: boolean = false;
  private tecven: boolean = false;

  datosusuario: UsuarioI = {
    nombre: null,
    rut: null,
    correo: null,
    nrotelefono: null,
    clave: null,
    cargo: null,
    nombretaller: null,
  };
  datostaller: Taller = {
    nombretaller: null,
    rutempresa: null,
    correotaller: null,
    nrotelefonotaller: null,
    direcciontaller: null,
    comuna: null,
    region: null,
  };

  nombretaller: string = null;

  talleres: Taller[] = [];

  mostrarAdmin(ev) {
    this.validarAdmin = ev.detail.value;
    console.log(ev);
    if (this.validarAdmin == 'Tecnico') {
      this.administrador = false;
      this.datosusuario.cargo = ev.detail.value;
      this.tecven = true;
    }
    else if (this.validarAdmin == 'Administrador') {
      this.administrador = true;
      this.tecven = false;
      this.datosusuario.cargo = ev.detail.value;
    }
    else if (this.validarAdmin == 'Vendedor') {
      this.administrador = false;
      this.tecven = true;
      this.datosusuario.cargo = ev.detail.value;
    }
  }

  constructor(private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService,
    private router: Router) { }

  ngOnInit() {
    this.traertalleres();
  }

  async crearcuenta() {
    const res = await this.auth.registrousuario(this.datosusuario).catch(error => {
      console.log(error);
    })
    if (res) {
      const pathI = 'Usuarios';
      const pathII = 'Taller';
      const id = res.user.uid;
      this.datosusuario.clave = null;
      this.datosusuario.nombretaller = this.nombretaller;
      if (this.validarAdmin == 'Tecnico') {
        await this.firestore.createDoc(this.datosusuario, pathI, id);
      }
      else if (this.validarAdmin == 'Administrador') {
        await this.firestore.createDoc(this.datosusuario, pathI, id);
        await this.firestore.createClient(this.datostaller, pathII);
      }
      else if (this.validarAdmin == 'Vendedor') {
        await this.firestore.createDoc(this.datosusuario, pathI, id);
      }
      console.log('Creado con exito');
      this.router.navigate(['/entrada']);
    }
  }

  traertalleres() {
    this.firestore.getCollection<Taller>('Taller').subscribe(res => {
      console.log(res);
      this.talleres = res;
    })
  }
}