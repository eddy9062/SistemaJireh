import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guards';
import { inject } from '@angular/core';
import { NotAuthGuard } from './core/guards/notauth,guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [() => inject(NotAuthGuard).canActivate()],
    loadComponent: () => import('./pages/security/login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'menu-home',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/home/components/menu-home/menu-home.page').then( m => m.MenuHomePage)
  },
  {
    path: 'activo-pendiente',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/actualiza/activo-pendiente/activo-pendiente.page').then( m => m.ActivoPendientePage)
  },
  {
    path: 'activo-actualiza',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/actualiza/activo-actualiza/activo-actualiza.page').then( m => m.ActivoActualizaPage)
  },
  {
    path: 'cliente',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/cliente/cliente.page').then( m => m.ClientePage)
  },
  {
    path: 'proveedor',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/proveedor/proveedor.page').then( m => m.ProveedorPage)
  },
   {
    path: 'tipo-operacion',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/tipo-operacion/tipo-operacion.page').then( m => m.TipoOperacionPage)
  },
  {
    path: 'categoria',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/categoria/categoria.page').then( m => m.CategoriaPage)
  },
  {
    path: 'articulos',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/articulo/articulo.page').then( m => m.ArticuloPage)
  },
  
  {
    path: 'bodega',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/bodega/bodega.page').then( m => m.BodegaPage)
  },
  {
    path: 'articulo',
    canActivate: [() => inject(AuthGuard).canActivate()],
    loadComponent: () => import('./pages/articulo/articulo/articulo.component').then( m => m.ArticuloComponent)
  },
  {
    path: 'venta',
    loadComponent: () => import('./pages/venta/venta.page').then( m => m.VentaPage)
  },
];
