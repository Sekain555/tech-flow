import { Component, OnInit } from '@angular/core';
import { UsuarioI, Taller } from 'src/app/models/modelos';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ccuenta',
  templateUrl: './ccuenta.page.html',
  styleUrls: ['./ccuenta.page.scss'],
})
export class CcuentaPage implements OnInit {

  datosusuario: UsuarioI = {
    nombre: null,
    rut: null,
    correo: null,
    nrotelefono: null,
    clave: null,
    cargo: 'administrador',
    nombretaller: null,
    tenantId: null
  };

  rinclave16: string = null;

  datostaller: Taller = {
    nombretaller: null,
    rutempresa: null,
    correotaller: null,
    nrotelefonotaller: null,
    direcciontaller: null,
    comuna: null,
    region: null,
  };

  constructor(
    private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService,
    private router: Router
  ) { }

  ngOnInit() { }

  async crearcuenta() {
    const res = await this.auth.registrousuario(this.datosusuario).catch(error => {
      console.log(error);
    });

    if (res) {
      const pathUsuarios = 'Usuarios';
      const uid = res.user.uid;

      this.datosusuario.clave = null;
      this.datosusuario.cargo = 'administrador';
      this.datosusuario.nombretaller = this.datostaller.nombretaller;
      this.datosusuario.tenantId = null;

      const tenantRef = await this.firestore.createTenant({
        ...this.datostaller,
        ownerUid: uid,
        estado: 'trial',
        creadoEn: new Date().toISOString()
      });

      const tenantId = tenantRef.id;
      this.datosusuario.tenantId = tenantId;

      await this.firestore.createDoc(this.datosusuario, pathUsuarios, uid);
      await this.firestore.setUserTenant(uid, {
        tenantId: tenantId,
        role: 'administrador'
      });
      await this.firestore.setTenantUser(tenantId, uid, this.datosusuario);

      console.log('Tenant creado:', tenantId);
      this.router.navigate(['/entrada']);
    }
  }
}