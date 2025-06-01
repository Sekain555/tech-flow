import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { UsuarioI, ClienteST, InventarioRepuesto, Dispositivos, Taller } from 'src/app/models/modelos';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';

@Component({
  selector: 'app-contactoclientes',
  templateUrl: './contactoclientes.page.html',
  styleUrls: ['./contactoclientes.page.scss'],
})
export class ContactoclientesPage implements OnInit {

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
  busquedacliente: string;
  private clientes: ClienteST[] = []

  perfil: string = null;
  usuario: string = null;
  taller: string = null;

  constructor(
    private firestore: FirestoredatabaseService,
    private auth: AuthfirebaseService
  ) {
    this.auth.estadousuario().subscribe(res => {
      if (res) {
        //está logeado
        this.obtenerusuario(res.uid)
      }
    })
  }

  ngOnInit() {
    this.traerclientes()
  }

  obtenerusuario(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<UsuarioI>(path, id).subscribe(res=>{
      if (res){
        this.perfil = res.cargo
        this.usuario = res.nombre
        this.taller = res.nombretaller
      }
    })
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

}
