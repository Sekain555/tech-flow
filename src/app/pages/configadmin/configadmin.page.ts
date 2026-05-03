import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { Taller } from 'src/app/models/modelos';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';
import { ToastController } from '@ionic/angular';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-configadmin',
  templateUrl: './configadmin.page.html',
  styleUrls: ['./configadmin.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigadminPage implements OnInit {
  taller: Taller = {
    nombretaller: null,
    rutempresa: null,
    correotaller: null,
    nrotelefonotaller: null,
    direcciontaller: null,
    comuna: null,
    region: null,
  };
  editando: boolean = false;

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.traertaller();
  }

  traertaller() {
    this.firestore.getTenant(this.session.tenantId).subscribe((res: any) => {
      if (res) {
        this.taller = res;
      }
    });
  }

  toggleEditar() {
    this.editando = !this.editando;
  }

  async guardarDatos() {
    await this.firestore.updateTenant(this.session.tenantId, {
      nombretaller: this.taller.nombretaller,
      correotaller: this.taller.correotaller,
      nrotelefonotaller: this.taller.nrotelefonotaller,
      direcciontaller: this.taller.direcciontaller,
    });
    this.editando = false;
    this.presentToast('Datos guardados correctamente');
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'bottom',
      duration: 1500,
    });
    await toast.present();
  }
}
