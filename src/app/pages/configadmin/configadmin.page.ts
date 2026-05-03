import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { Taller } from 'src/app/models/modelos';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper';

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

  constructor(
    private firestore: FirestoredatabaseService,
    private session: SessionService,
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
}
