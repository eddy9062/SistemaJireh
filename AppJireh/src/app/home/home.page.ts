import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuHomePage } from '../pages/home/components/menu-home/menu-home.page';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuService } from '../core/services/menu.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,MenuHomePage,CommonModule],
})
export class HomePage implements OnInit{

  public menu: Array<any> = []
  
  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.cargarMenu()
    console.log('llegue homepage')
  }


  private async cargarMenu() {
    this.menu = await this.menuService.obtenerMenu()
    console.log(this.menu)
  }
  
  public redirect(menu: any){
    this.router.navigate([menu.url]);
  }
}