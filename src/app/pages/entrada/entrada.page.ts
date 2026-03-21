import { Component, OnInit } from '@angular/core';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { Router } from '@angular/router';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { UsuarioI } from 'src/app/models/modelos';
import { SessionService } from 'src/app/services/session.service';

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

  constructor(
    private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService,
    private route: Router,
    private session: SessionService,
  ) {
    this.auth.estadousuario().subscribe((res) => {
      if (res) {
        //está logeado
        this.verificalogeo = true;
        this.obtenerusuario(res.uid);
      } else {
        //sin logear
        this.verificalogeo = false;
        this.route.navigate(['/recepcion']);
      }
    });
  }

  ngOnInit() {}

  logout() {
    this.auth.logout();
    this.route.navigate(['/recepcion']);
  }

  obtenerusuario(uid: string) {
    this.firestore.getUserTenant(uid).subscribe((res: any) => {
      if (res) {
        this.perfil = res.role;
        this.taller = res.tenantId;

        // Verificar estado del tenant
        this.firestore.getTenant(res.tenantId).subscribe((tenant: any) => {
          if (tenant && tenant.estado === 'suspendido') {
            this.auth.logout();
            this.route.navigate(['/recepcion']);
            return;
          }

          this.session.setSession({
            tenantId: res.tenantId,
            role: res.role,
            uid: uid,
          });
        });
      }
    });
  }

  estadisticas() {
    this.route.navigate(['/menuresumen']);
  }
}
