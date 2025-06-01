import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { UsuarioI, Taller } from 'src/app/models/modelos';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-configadmin',
  templateUrl: './configadmin.page.html',
  styleUrls: ['./configadmin.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigadminPage implements OnInit {

  id: string = null;

  

  talleres: Taller[] = [];

  taller: Taller = {
    nombretaller: null,
    rutempresa: null,
    correotaller: null,
    nrotelefonotaller: null,
    direcciontaller: null,
    comuna: null,
    region: null,
  }

  constructor(
    private firestore: FirestoredatabaseService,
    private auth: AuthfirebaseService,
  ) {
    this.auth.estadousuario().subscribe(res => {
      if (res) {
        //está logeado
        this.obtenerusuario(res.uid);
      }
    })
  }

  ngOnInit() {
  }

  obtenerusuario(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<UsuarioI>(path, id).subscribe(res => {
      if (res) {
        console.log(res);
        this.taller.nombretaller = res.nombretaller
        console.log(this.taller);
        this.traertalleres();
      }
    })
  }

  traertalleres() {
    this.firestore.getDoc<Taller>('Taller', this.taller.nombretaller).subscribe(res => {
      console.log(res)
    
    })
  }
}