import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserexpService {

  load: any;

    constructor(
        public toast: ToastController,
        public loading: LoadingController) { }

    async showToast(mensaje: string) {
        const toast = await this.toast.create({
            message: mensaje,
            duration: 2000
        });
        toast.present();
    }

    async showLoading(mensaje: string) {
        this.load = await this.loading.create({
            cssClass: 'my-custom-class',
            message: mensaje,
        });
        await this.load.present();
    }

    async closeLoading() {
        await this.load.dismiss();
    }

}