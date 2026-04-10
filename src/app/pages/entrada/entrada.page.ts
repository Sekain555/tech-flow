import { Component, OnInit } from '@angular/core';
import { AuthfirebaseService } from 'src/app/services/authfirebase.service';
import { Router } from '@angular/router';
import { FirestoredatabaseService } from 'src/app/services/firestoredatabase.service';
import { SessionService } from 'src/app/services/session.service';
import { Ordenes, ClienteST, InventarioRepuesto } from 'src/app/models/modelos';

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

  // --- ONBOARDING ---
  mostrarOnboarding: boolean = false;

  // --- DATOS DASHBOARD ---
  ordenesPendientes: number = 0;
  ordenesFinalizadas: number = 0;
  ultimasOrdenes: Ordenes[] = [];
  totalClientes: number = 0;
  repuestosCriticos: number = 0;
  repuestesSinStock: number = 0;

  readonly STOCK_CRITICO = 3;

  constructor(
    private auth: AuthfirebaseService,
    private firestore: FirestoredatabaseService,
    private route: Router,
    private session: SessionService,
  ) {
    this.auth.estadousuario().subscribe((res) => {
      if (res) {
        this.verificalogeo = true;
        this.obtenerusuario(res.uid);
      } else {
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
        this.session.setSession({
          tenantId: res.tenantId,
          role: res.role,
          uid: uid,
          
        });

        this.obtenerNombreUsuario(res.tenantId, uid);

        this.firestore.getTenant(res.tenantId).subscribe((tenant: any) => {
          if (tenant && tenant.estado === 'suspendido') {
            this.auth.logout();
            this.route.navigate(['/recepcion']);
            return;
          }

          if (
            this.perfil === 'administrador' &&
            tenant &&
            tenant.onboardingCompletado === false
          ) {
            this.mostrarOnboarding = true;
          }

          this.cargarDashboard();
        });
      }
    });
  }

  async completarOnboarding() {
    await this.firestore.updateTenant(this.session.tenantId, {
      onboardingCompletado: true,
    });
    this.mostrarOnboarding = false;
  }

  omitirOnboarding() {
    this.mostrarOnboarding = false;
  }

  cargarDashboard() {
    const tenantId = this.session.tenantId;

    this.firestore
      .getCollectionByTenant<Ordenes>('workorders', tenantId)
      .subscribe((ordenes) => {
        this.ordenesPendientes = ordenes.filter(
          (o) =>
            o.estado === 'ingresado' ||
            o.estado === 'en reparacion' ||
            o.estado === 'esperando repuesto',
        ).length;
        this.ordenesFinalizadas = ordenes.filter(
          (o) => o.estado === 'reparado' || o.estado === 'sin reparacion',
        ).length;
        this.ultimasOrdenes = ordenes
          .sort(
            (a, b) =>
              new Date(b.inforden.fechahoy).getTime() -
              new Date(a.inforden.fechahoy).getTime(),
          )
          .slice(0, 5);
      });

    this.firestore
      .getCollectionByTenant<ClienteST>('clients', tenantId)
      .subscribe((clientes) => {
        this.totalClientes = clientes.length;
      });

    this.firestore
      .getCollectionByTenant<InventarioRepuesto>('inventory', tenantId)
      .subscribe((repuestos) => {
        this.repuestosCriticos = repuestos.filter(
          (r) => r.cantidad > 0 && r.cantidad <= this.STOCK_CRITICO,
        ).length;
        this.repuestesSinStock = repuestos.filter(
          (r) => r.cantidad === 0,
        ).length;
      });
  }

  estadisticas() {
    this.route.navigate(['/menuresumen']);
  }

  colorEstado(estado: string): string {
    switch (estado) {
      case 'ingresado':
        return 'primary';
      case 'en reparacion':
        return 'warning';
      case 'esperando repuesto':
        return 'tertiary';
      case 'reparado':
        return 'success';
      case 'sin reparacion':
        return 'danger';
      default:
        return 'medium';
    }
  }

  obtenerNombreUsuario(tenantId: string, uid: string) {
    this.firestore
      .getDocByTenant<any>('users', tenantId, uid)
      .subscribe((res) => {
        if (res) {
          this.usuario = res.nombre;
        }
      });
  }
}
