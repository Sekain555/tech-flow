import { Component, OnInit } from '@angular/core';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { Router } from '@angular/router';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { UsuarioI } from 'src/app/models/modelos';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.page.html',
  styleUrls: ['./entrada.page.scss'],
})
export class EntradaPage implements OnInit {

  verificalogeo: boolean = false;
  perfil: string = null;
  usuario: string = null;
  taller: string = null;

  constructor(private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService,
    private route: Router) {
    this.auth.estadousuario().subscribe(res => {
      if (res) {
        //está logeado
        this.verificalogeo = true;
        this.obtenerusuario(res.uid)
      }
      else {
        //sin logear
        this.verificalogeo = false;
        this.route.navigate(['/recepcion']);
      }
    })
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.route.navigate(['/recepcion']);
  }

  obtenerusuario(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<UsuarioI>(path, id).subscribe(res=>{
      if (res){
        this.perfil = res.cargo
        this.usuario = res.nombre
        this.taller = res.nombretaller
        console.log(this.perfil)
      }
    })
  }

  estadisticas(){
    if (this.perfil == 'Administrador'){
      this.route.navigate(['/menuresumen']);
      console.log('Voy al admin');
    }
    else if (this.perfil == 'Tecnico'){
      this.route.navigate(['/menuresumentec']);
      console.log('Voy al tecn');
    }
    else if (this.perfil == 'Vendedor'){
      this.route.navigate(['/menuresumenven']);
      console.log('Voy al vend');
    }
  }

}