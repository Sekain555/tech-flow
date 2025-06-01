import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { Router } from '@angular/router';
import { UserexpService } from 'src/app/services/userexp.service';
import SwiperCore, { Autoplay, Lazy, Navigation, Pagination } from 'swiper';

SwiperCore.use([Autoplay, Lazy, Navigation, Pagination]);

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.page.html',
  styleUrls: ['./recepcion.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecepcionPage implements OnInit {
  token: any;
  nrorden: any;
  correo: any;
  validcorreo: boolean = false;

  credenciales = {
    correo: null,
    password: null
  }

  constructor(
    private http: HttpClient,
    private auth: AuthfirebaseService,
    private router: Router,
    private interaction: UserexpService
  ) { }

  ngOnInit() {

  }

  async login() {
    console.log(this.credenciales);
    const res = await this.auth.login(this.credenciales.correo, this.credenciales.password)
    if (res) {
      console.log(res);
      this.router.navigate(['/entrada'])
      this.modal.dismiss(null)
    }
  }

  @ViewChild(IonModal) modal: IonModal;

  volver() {
    this.modal.dismiss(null);
  }

}