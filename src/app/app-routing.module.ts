import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'recepcion',
    pathMatch: 'full'
  },
  {
    path: 'entrada',
    loadChildren: () => import('./pages/entrada/entrada.module').then(m => m.EntradaPageModule)
  },
  {
    path: 'ccuenta',
    loadChildren: () => import('./pages/ccuenta/ccuenta.module').then(m => m.CcuentaPageModule)
  },
  {
    path: 'recepcion',
    loadChildren: () => import('./pages/recepcion/recepcion.module').then(m => m.RecepcionPageModule)
  },
  {
    path: 'menuordenes',
    loadChildren: () => import('./pages/menuordenes/menuordenes.module').then(m => m.MenuordenesPageModule)
  },
  {
    path: 'nuevaorden',
    loadChildren: () => import('./pages/nuevaorden/nuevaorden.module').then( m => m.NuevaordenPageModule)
  },
  {
    path: 'estadisticasorden',
    loadChildren: () => import('./pages/estadisticasorden/estadisticasorden.module').then( m => m.EstadisticasordenPageModule)
  },
  {
    path: 'registroorden',
    loadChildren: () => import('./pages/registroorden/registroorden.module').then( m => m.RegistroordenPageModule)
  },
  {
    path: 'menuinventario',
    loadChildren: () => import('./pages/menuinventario/menuinventario.module').then( m => m.MenuinventarioPageModule)
  },
  {
    path: 'menuclientes',
    loadChildren: () => import('./pages/menuclientes/menuclientes.module').then( m => m.MenuclientesPageModule)
  },
  {
    path: 'menuresumen',
    loadChildren: () => import('./pages/menuresumen/menuresumen.module').then( m => m.MenuresumenPageModule)
  },
  {
    path: 'anadirrepuesto',
    loadChildren: () => import('./pages/anadirrepuesto/anadirrepuesto.module').then( m => m.AnadirrepuestoPageModule)
  },
  {
    path: 'registrorepuesto',
    loadChildren: () => import('./pages/registrorepuesto/registrorepuesto.module').then( m => m.RegistrorepuestoPageModule)
  },
  {
    path: 'nuevocliente',
    loadChildren: () => import('./pages/nuevocliente/nuevocliente.module').then( m => m.NuevoclientePageModule)
  },
  {
    path: 'registroclientes',
    loadChildren: () => import('./pages/registroclientes/registroclientes.module').then( m => m.RegistroclientesPageModule)
  },
  {
    path: 'contactoclientes',
    loadChildren: () => import('./pages/contactoclientes/contactoclientes.module').then( m => m.ContactoclientesPageModule)
  },
  {
    path: 'configadmin',
    loadChildren: () => import('./pages/configadmin/configadmin.module').then( m => m.ConfigadminPageModule)
  },
  {
    path: 'menuvideos',
    loadChildren: () => import('./pages/menuvideos/menuvideos.module').then( m => m.MenuvideosPageModule)
  },
  {
    path: 'registrovideos',
    loadChildren: () => import('./pages/registrovideos/registrovideos.module').then( m => m.RegistrovideosPageModule)
  },
  {
    path: 'menuresumentec',
    loadChildren: () => import('./pages/menuresumentec/menuresumentec.module').then( m => m.MenuresumentecPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
