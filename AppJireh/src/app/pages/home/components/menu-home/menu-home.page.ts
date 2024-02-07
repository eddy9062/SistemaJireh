import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SessionService } from 'src/app/core/services/security/session.service';
import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/core/services/menu.service';


@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.page.html',
  styleUrls: ['./menu-home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterLink]
})
export class MenuHomePage implements OnInit {
  
  public menu: Array<any> = []
  

  private subToken?: Subscription
  public nombreUsuario: string = "N/A"
  public appVersionStr?: string;
  public _token: any
  
  constructor(
    private sessionService: SessionService,
    public menuCtrl: MenuController,
    private router: Router,
    private menuService: MenuService
    //private menuService: MenuService,
  ) {


  }

  ngOnInit() {
    this.subToken = this.sessionService.usuarioStrSub()?.subscribe(usuario => {
      this.nombreUsuario = usuario?.toUpperCase() || 'SIN USUARIO'
      this.cargarMenu()
    })
    
//console.log(this.subToken)
  }



  private async cargarMenu() {
    this.menu = await this.menuService.obtenerMenu()
    //console.log(this.menu)
  }
  
  public redirect(menu: any){
    this.router.navigate([menu.url]);

  }

  public menuClose(){
    this.menuCtrl.close()
  }


  public cerrarSesion() {
    this.menuCtrl.close()
    this.sessionService.logOut()
  }


  ngOnDestroy(): void { 
    this.subToken?.unsubscribe()
  }


  ngAfterViewInit() {
    if (Capacitor.isNativePlatform()) {
      App.getInfo().then(info => {
        this.appVersionStr = info.version
      });
    } else {
      this.appVersionStr = environment.version
    }
  }

}
