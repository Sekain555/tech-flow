import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Ordenes } from 'src/app/models/modelos';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-registroorden',
  templateUrl: './registroorden.page.html',
  styleUrls: ['./registroorden.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RegistroordenPage implements OnInit {

  ordenes: Ordenes[] = [];

  constructor(
    private navCtrl: NavController,
    private firestore: FirestoredatabaseService
  ) { }

  ngOnInit() {
    this.traerordenes()
  }

  traerordenes() {
    this.firestore.getCollection<Ordenes>('Ordenes').subscribe(res => {
      console.log(res);
      this.ordenes = res;
    })
  }

  @ViewChild(IonModal) modal: IonModal;

}