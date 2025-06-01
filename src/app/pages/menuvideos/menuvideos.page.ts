import { Component, OnInit } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { Taller } from 'src/app/models/modelos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menuvideos',
  templateUrl: './menuvideos.page.html',
  styleUrls: ['./menuvideos.page.scss'],
})
export class MenuvideosPage implements OnInit {

  talleres: Taller[] = [];

  tallerplaylist: Taller = {
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
    private router: Router
  ) { }

  ngOnInit() {
    this.traertalleres();
  }

  traertalleres() {
    this.firestore.getCollection<Taller>('Taller').subscribe(res => {
      console.log(res)
      this.talleres = res;
    })
  }

  verplaylist() {
    console.log(this.tallerplaylist)
    sessionStorage.setItem('tokenvideo',this.tallerplaylist.nombretaller)
    this.router.navigate(['/registrovideos'])
  }
}