import { Injectable } from '@angular/core';
import { SessionService } from './security/session.service';
import { MenuModel } from './models/MenuModel';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menu: MenuModel[] = [
    {
      icono: 'people-outline',
      title: 'Clientes',
      url: '/cliente',
      roles: ['ADMIN']
    },
    {
      icono: 'people-circle-outline',
      title: 'Proveedores',
      url: '/proveedor',
      roles: ['ADMIN']
    },
    {
      icono: 'briefcase-outline',
      title: 'Bodegas',
      url: '/bodega',
      roles: ['ADMIN']
    },
    {
      icono: 'trail-sign-outline',
      title: 'Tipo de Operacoón',
      url: '/tipo-operacion',
      roles: ['ADMIN']
    },
    {
      icono: 'pricetags-outline',
      title: 'Categoría Producto',
      url: '/categoria',
      roles: ['ADMIN']
    },
    {
      icono: 'library-outline',
      title: 'Productos',
      url: '/articulos',
      roles: ['ADMIN']
    },
    {
      icono: 'cash-outline',
      title: 'Ventas',
      url: '/venta',
      roles: ['ADMIN']
    }
    
  ]

  constructor(
    private sessionService: SessionService,
  ) { 
    this.obtenerMenu()
  }

public getMenu(){
  return this.menu
}

  async obtenerMenu() {
    let menuNuevo = []
    
    
    for (let item of this.menu) {      
      for(let rol of item.roles){
        /*console.log(rol)
        console.log(item)*/
        if(await this.sessionService.validarRol(rol)){
          menuNuevo.push(item)
        }
      }
    }
    return menuNuevo 
  }
}
